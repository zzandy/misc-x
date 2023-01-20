using System.ComponentModel;
using System.Text.Json;
using System;
using Xunit;

namespace Bitflood.Tests;

public class DebugEntries
{
    [Category("Debug")]
    [Fact]
    public void Test1()
    {
        var path = @"D:\data\ubuntu-22.10-desktop-amd64.iso.torrent";
        path=@"d:\data\Долина муми-троллей Moominvalley Сезон 1 Серии 13 из 13 (Марика Макарова, Стив Бокс Marika Makaroff, Steve Box) [2019, Ф [rutracker-6059364].torrent";

        var parsed = BEncoding.Decode(System.IO.File.OpenRead(path));

        Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(parsed, new JsonSerializerOptions() { WriteIndented = true }));
    }
}
