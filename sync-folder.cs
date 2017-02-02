using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;

namespace sync_folders
{
	internal class Program
	{
		private static void Main(string[] args)
		{
			if (args.Length != 2)
				Die();

			string mainFolder = Path.GetFullPath(args[0]);
			string diffFolder = Path.GetFullPath(args[1]);

			if (!Directory.Exists(mainFolder))
				Die("Folder must exist: " + mainFolder);

			if (!Directory.Exists(diffFolder))
				Die("Folder must exist: " + diffFolder);

			var files = new ConcurrentDictionary<string, ConcurrentBag<File>>();


			var pg1 = new Progress();
			var pg2 = new Progress();


			using (new Reporter("Reading", pg1, pg2))
			{
				Task readMain = Task.Factory.StartNew(() => Fill(files, mainFolder, MainFile.Make, pg1));
				Task readDiff = Task.Factory.StartNew(() => Fill(files, diffFolder, DiffFile.Make, pg2));

				Task.WaitAll(readMain, readDiff);
			}

			IEnumerable<ConcurrentBag<File>> dub = from list in files.Values
				where list.Count > 1 && list.All(file => file is MainFile)
				select list;

			IEnumerable<File> upd = from list in files.Values
				where list.All(file => file is DiffFile)
				select list.First();

			var rms = new List<string>();

			Func<string, string> stripMain = s => s.Replace(mainFolder + Path.DirectorySeparatorChar, "");
			Func<string, string> stripDiff = s => s.Replace(diffFolder + Path.DirectorySeparatorChar, "");

			Console.WriteLine("cd \"" + mainFolder + "\"");
			foreach (var set in dub)
			{
				File first = set.OrderBy(f => System.IO.File.GetLastWriteTime(f.Path)).First();

				foreach (var file1 in set)
				{
					if (file1 != first)
					{
						rms.Add(file1.Path);
						Console.WriteLine("erase /f \"" + stripMain(file1.Path) + "\" &:: " + stripMain(first.Path));
					}
				}
			}

			Console.WriteLine("cd \"" + diffFolder + "\"");

			foreach (var file in upd)
			{
				string target = file.Path.Replace(diffFolder, mainFolder);

				int n = 0;
				while (System.IO.File.Exists(target) && !rms.Contains(target))
				{
					target = Path.Combine(Path.GetDirectoryName(target),
						Path.GetFileNameWithoutExtension(target) + "(" + ++n + ")" + Path.GetExtension(target));
				}

				Console.WriteLine("copy \"{0}\" \"{1}\"", stripDiff(file.Path), target);
			}
		}

		public static void Fill(ConcurrentDictionary<string, ConcurrentBag<File>> files, string path,
			Func<string, File> factory, Progress pg)
		{
			var sha = new SHA256Managed();
			sha.Initialize();

			List<string> list = Directory.EnumerateFiles(path, "*", SearchOption.AllDirectories).ToList();

			int count = list.Count;
			int n = 0;
			Console.Error.WriteLine("\r" + count + " files in " + path);

			foreach (var file in list)
			{
				byte[] hashBytes = sha.ComputeHash(System.IO.File.OpenRead(file));
				string hash = BitConverter.ToString(hashBytes).Replace("-", "");

				files.AddOrUpdate(hash, h => new ConcurrentBag<File> {factory(file)}, (h, l) =>
				{
					l.Add(factory(file));
					return l;
				});

				pg.Report(++n, count);
			}
		}

		public static void Die(string message = null)
		{
			if (message == null)
				PrintUsage();
			else Console.Error.WriteLine(message);

			Environment.Exit(1);
		}

		public static void PrintUsage()
		{
			Console.Error.WriteLine(Path.GetFileName(Assembly.GetEntryAssembly().CodeBase) + " <sync-folder> <changes-folder>");
		}

		internal abstract class File
		{
			protected File(string fileName)
			{
				Path = fileName;
			}

			public string Path { get; private set; }
		}

		private class MainFile : File
		{
			private MainFile(string fileName)
				: base(fileName)
			{
			}

			public static MainFile Make(string fileName)
			{
				return new MainFile(fileName);
			}
		}

		private class DiffFile : File
		{
			private DiffFile(string fileName) : base(fileName)
			{
			}

			public static DiffFile Make(string fileName)
			{
				return new DiffFile(fileName);
			}
		}

		internal sealed class Progress
		{
			public event EventHandler<ProgressUpdatedEventArgs> ProgressChanged;

			private void OnProgressChanged(int current, int total)
			{
				EventHandler<ProgressUpdatedEventArgs> handler = ProgressChanged;
				if (handler != null) handler(this, new ProgressUpdatedEventArgs(current, total));
			}

			public void Report(int current, int total)
			{
				OnProgressChanged(current, total);
			}
		}

		private sealed class Pair<TItem>
		{
			public TItem Current { get; private set; }
			public TItem Total { get; private set; }

			public Pair(TItem current, TItem total)
			{
				Current = current;
				Total = total;
			}

			public void Set(TItem current, TItem total)
			{
				Current = current;
				Total = total;
			}
		}

		private sealed class Reporter : IDisposable
		{
			private const int FrameTime = 50;
			private readonly string _message;
			private readonly Dictionary<Progress, Pair<int>> _pregresses;
			private int _len;

			private readonly string[] _frames =
			{
				"(------",
				"-(-----",
				"--|----",
				"---|---",
				"----|--",
				"-----)-",
				"------)",
				"------)",
				"-----)-",
				"----|--",
				"---|---",
				"--|----",
				"-(-----",
				"(------",

				
			};

			private int _frameno = -1;
			private readonly Timer _timer;
			private readonly Stopwatch _watch;

			public Reporter(string message, params Progress[] progresses)
			{
				_message = message;
				_pregresses = progresses.ToDictionary(p => p, p => new Pair<int>(0, 0));
				_timer = new Timer(Callback, null, FrameTime, FrameTime);
				_len = 0;

				_watch = Stopwatch.StartNew();

				foreach (var progress in progresses)
				{
					progress.ProgressChanged += progress_ProgressChanged;
				}
			}

			private void Callback(object state)
			{
				List<decimal> numbers = (from pair in _pregresses.Values
					where pair.Total > 0
					select (decimal) pair.Current/pair.Total).ToList();

				string frame = _frames[++_frameno%_frames.Length];
				string text;
				TimeSpan elapsed = _watch.Elapsed;

				if (numbers.Count > 0)
				{
					decimal progress = 100*numbers.Sum()/numbers.Count;

					if (progress > 20)
					{
						TimeSpan eta = TimeSpan.FromTicks((long) (100*elapsed.Ticks/progress)) - elapsed;
						text = string.Format("{0} {1} {2:00.0} {3:hh\\:mm\\:ss\\.fff} ETA: {4:hh\\:mm\\:ss\\.fff}", _message, frame,
							progress,
							elapsed, eta);
					}

					else
						text = string.Format("{0} {1} {2:00.0} {3:hh\\:mm\\:ss\\.fff}", _message, frame, progress, elapsed);
				}
				else
					text = string.Format("{0} {1} {2:g}", _message, frame, elapsed);

				Console.Error.Write("\r{0,-" + _len + "}", text);
				_len = text.Length;
			}

			private void progress_ProgressChanged(object sender, ProgressUpdatedEventArgs e)
			{
				if (sender is Progress && _pregresses.ContainsKey(sender as Progress))
				{
					_pregresses[sender as Progress].Set(e.Current, e.Total);
				}
			}

			public void Dispose()
			{
				_timer.Change(Timeout.Infinite, Timeout.Infinite);
				_watch.Stop();
				Console.Error.WriteLine("\r{0,-" + _len + "}", _message + " ... " + _watch.Elapsed);
			}
		}
	}

	internal class ProgressUpdatedEventArgs
	{
		public int Current { get; private set; }
		public int Total { get; private set; }

		public ProgressUpdatedEventArgs(int current, int total)
		{
			Current = current;
			Total = total;
		}
	}
}