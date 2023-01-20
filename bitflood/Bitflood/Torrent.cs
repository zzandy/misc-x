using System.Collections.ObjectModel;

public sealed class Torrent
{
    public string? Announce { get; init; }
    public string? Comment { get; init; }
    public IReadOnlyCollection<IReadOnlyCollection<string>> AnnounceList { get; init; }
    public string? CreatedBy { get; init; }
    public DateTime CreationDate { get; init; }
    public System.Text.Encoding? Encoding { get; init; }
    public TorrentInfo Info { get; init; }

    public Torrent FromBEncoding(Dictionary<string, object> torrent)
    {
        T Get<T>(string name, T defaultValue = default)
        {
            if (!torrent.ContainsKey(name)) return defaultValue;

            var value = torrent[name];

            return value is T s ? s : defaultValue;
        }

        var info = Get<Dictionary<string, object>>("info", new Dictionary<string, object>());

        return new Torrent
        {
            Announce = Get<string?>("announce", default),
            AnnounceList = new ReadOnlyCollection<IReadOnlyCollection<string>>(Get<IEnumerable<object>>("announce-list", Enumerable.Empty<object>())
            .Select(x => x is IEnumerable<object> l ? l : Enumerable.Empty<object>())
            .Select(x => new ReadOnlyCollection<string>(x.Select(y => y is string s ? s : String.Empty).ToList()) as IReadOnlyCollection<string>).ToList()),
            Comment = Get<string?>("comment", default),
            CreatedBy = Get<string?>("created by", default),
            CreationDate = UnixTimeStampToDateTime(Get<long>("creation date", 0)),
            Encoding = System.Text.Encoding.GetEncoding(Get<string?>("encoding", default) ?? "utf8"),
            Info = new TorrentInfo
            {
                Name = Get<string?>("name"),
                Length = Get<long>("length"),
                PieceLength = Get<long>("piece length"),
                //Pieces=new ReadOnlyCollection<byte[]>(Get<IList<object>>)
            }
        };
    }

    public static DateTime UnixTimeStampToDateTime(long unixTimeStamp)
    {
        System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
        dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
        return dtDateTime;
    }
}

public sealed class TorrentInfo
{
    public long Length { get; init; }
    public string? Name { get; init; }
    public long PieceLength { get; init; }
    public IReadOnlyCollection<byte[]> Pieces { get; init; }
    public IReadOnlyCollection<TorrentFileInfo>? Files { get; init; }
}

public sealed class TorrentFileInfo
{
    public string Path { get; init; }
    public long Length { get; init; }
}

