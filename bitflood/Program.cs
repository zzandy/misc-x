using System.Text.Json;

var data = "d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)13:creation datei1460444420e8:encoding5:UTF-84:infod6:lengthi59616e4:name9:lorem.txt12:piece lengthi32768e6:pieces3:4437:privatei0eee";


var path = @"D:\data\ubuntu-22.10-desktop-amd64.iso.torrent";

var parsed = BEncoding.Decode(System.IO.File.OpenRead(path));

Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(parsed, new JsonSerializerOptions(){WriteIndented=true}));

public static class BEncoding
{
    public static readonly object End = new Object();

    public static Object Decode(Stream stream)
    {
        return stream.ReadByte() switch
        {
            'd' => ReadDictionary(stream),
            'l' => ReadList(stream),
            'i' => ReadInt(stream),
            'e' => End,
            int b when b >= '0' && b <= '9' => ReadString(stream, b - '0'),
            _ => throw new Exception("Value not supported")
        };
    }

    private static string ReadString(Stream stream, int len = 0)
    {
        int b;
        while ((b = stream.ReadByte()) != ':')
        {
            len = len * 10 + (b - '0');
        }

        var array = new byte[len];
        stream.Read(array, 0, len);

        return len > 100 ? $"string of {len} bytes" : System.Text.UTF8Encoding.UTF8.GetString(array);
    }

    private static long ReadInt(Stream stream)
    {
        int b;
        long sum = 0;
        while ((b = stream.ReadByte()) != 'e')
        {
            sum = sum * 10 + (b - '0');
        }

        return sum;
    }

    private static List<object> ReadList(Stream stream)
    {
        var res = new List<object>();
        object item;
        while (!Object.ReferenceEquals(item = Decode(stream), End))
        {
            res.Add(item);
        }

        return res;
    }

    private static Dictionary<string, object> ReadDictionary(Stream stream)
    {
        var res = new Dictionary<string, object>();

        int b;
        while ((b = stream.ReadByte()) != 'e')
        {
            res.Add((ReadString(stream, b - '0')), Decode(stream));
        }

        return res;
    }
}

