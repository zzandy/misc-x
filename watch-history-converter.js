let links = [].filter.call(document.getElementsByTagName('a'), a => a.href.includes('watch'))
let chart = {}
for (let i of links) { let id = i.href.split('=')[1]; if (id in chart) chart[id][0]++; else chart[id] = [1, i.innerText] }
let data = Object.entries(chart)
data.sort((a, b) => b[1][0] - a[1][0])
for (var i in data) document.write(`<div>${i + 1}. <a href="https://www.youtube.com/watch?v=${data[i][0]}">${data[i][1][1]}<br/><img src="https://img.youtube.com/vi/${data[i][0]}/hqdefault.jpg"/></a></div>`);