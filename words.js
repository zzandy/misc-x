const supply = 'вей ре ту стек ка му бал мыш ха со ла сок ча та си ку ба га то да ва го ло за тру ра ша ви ли ор кон ма бан ок ар ро ше сы на ма ван ди ле по ру но нан кат'
    .split(' ')
    .concat(['мо', 'ко', 'ца', 'па', 'са', 'ни', 'тор', 'зи', 'ля', 'зор', 'во', 'чай', 'лес', 'у', 'ри', 'ме', 'лен', 'фа', 'ке', 'кар', 'мет', 'ве', 'те', 'фон',
        'до', 'тош', 'де', 'пра', 'рос', 'ток', 'пар', 'доб', 'пе', 'мок', 'ран', 'бор', 'ши', 'лон', 'бот', 'пу', 'не', 'соль', 'мель', 'я', 'е'])
    .reduce((s, p) => { if (p in s) ++s[p]; else s[p] = 1; return s }, {})

//console.log(supply)

const words = 'боль-шой бел-ка бель-е ба-нан бас-сейн быс-трый бан-ка борь-ба вью-га вес-на ве-тер вед-ро вер-блюд ван-на вмес-те вой-на воп-рос вет-ка гнез-до груп-па гру-ша гос-ти го-лубь граб-ли гло-бус гал-стук го-род ге-рой друзь-я день-ки дет-ство дуп-ло друж-ба дос-ка день-ги дет-ский де-кабрь е-нот е-жи е-ли е-го ель-ник е-да е-щё ер-ши ё-жик ёл-ка ём-кость ёл-кин ё-лок ём-кий жу-равль жи-раф жё-лудь жиль-ё жёл-тый жур-чит жир-ный жёс-ткий жуж-жит зме-я за-яц зав-трак здрав-ствуй звез-да зай-ка зем-ля зон-тик зав-тра и-ней и-рис и-ва и-юнь и-мя иг-ла йо-гурт йо-га йот-та йо-да йо-го йош-кар йо-дом йо-ги йо-гой кош-ка конь-ки ко-рабль коль-цо кни-га кло-ун крос-сворд кук-ла крыль-я крас-ный лис-тья луч-ше ло-шадь льди-на лай-ка лей-ка люс-тра лис-тьев лис-тва лан-дыш мед-ведь маль-чик май-ский мор-ковь май-ка мет-ро мас-ло мыш-ка мор-ской но-ябрь нель-зя ночь-ю нит-ка нит-ки на-ряд на-деть нос-ки ноч-ник о-сень о-кунь ок-но о-лень объ-езд о-гонь о-чень о-рех о-тец о-бед паль-то подъ-ём подъ-езд пись-мо плать-е праз-дник пор-тфель перь-я птич-ка пе-нал рус-ский ручь-и рас-сказ руч-ка реч-ка ра-дость ра-йон разъ-езд рас-свет семь-я сол-нце сен-тябрь сес-тра свёк-ла сказ-ка смот-рит сос-на строй-ка счас-тье тет-радь трам-вай те-атр тра-ва тюль-пан тык-ва трак-тор трой-ка то-поль туф-ли у-тюг ут-ка ут-ро у-лей у-хо у-ши у-рок уль-и у-жин у-кол фо-нарь фут-бол фев-раль фо-кус фир-ма фа-кел фиш-ка фи-нал фе-я хок-кей храб-рый хво-я хо-лод хо-рёк хлопь-я хи-рург хит-рый цап-ля цве-ток циф-ра цар-ство ци-линдр цы-ган цо-кот ца-ца це-лый чай-ник чай-ка чаш-ка чув-ства чет-верг чис-тый час-тый чес-нок час-то чу-жой шап-ка шос-се шиш-ка ша-рик шут-ка ше-я школь-ник шиш-ки шко-ла ща-вель ще-нок щу-ка щёт-ка щуп-лый щеп-ка щен-ка щуч-ка щет-кой э-таж эк-ран э-то э-хо эк-спресс э-липс эк-сперт ю-ла юн-га юб-ка ю-ный юн-нат юр-кий я-корь я-зык яс-треб я-ма яй-цо я-щик я-сень яр-кий ян-варь ал-ле-я а-пель-син а-на-нас ав-то-бус ап-рель-ский а-ку-ла аз-бу-ка ал-фа-вит аб-ри-кос ба-боч-ка ба-буш-ка боль-ша-я бе-лоч-ка ба-ра-бан бо-гат-ство бо-тин-ки баш-мач-ки боль-ши-е бак-ла-жан ва-рень-е во-ро-бей во-робь-и ве-сен-ний ва-лен-ки ви-ног-рад ве-се-ло веж-ли-вость выс-тав-ка ви-нег-рет гвоз-ди-ка ге-ро-и горь-ка-я ги-та-ра гра-дус-ник го-род-ской гер-ку-лес де-воч-ка де-ревь-я де-жур-ный де-рев-ня де-ревь-ев де-душ-ка дож-дли-вый де-воч-ки де-ревь-ях до-рож-ки ё-жи-ки е-хид-на е-жи-ха е-ра-лаш е-рун-да ё-лоч-ка ёр-ши-ки ёл-ка-ми ё-лоч-ках ё-жат-ся ё-жил-ся ё-жи-ком ё-жи-ку ёр-ши-ку ём-кос-тной жар-ко-е жа-лю-зи жу-рав-ли жёр-доч-ка жёл-ты-е жа-ди-на же-вач-ка же-лу-док жи-вот-ных здрав-ствуй-те зо-о-парк здо-ровь-е зер-ка-ло за-гад-ка за-мет-ка зе-лё-ный зда-ни-е за-ряд-ка зи-мовь-е иг-руш-ки и-гол-ка иг-ра-ю ис-кус-ство и-ме-на иг-ра-ют и-вол-га ин-дей-ка из-буш-ка йо-гур-та йо-гур-том йе-ме-не йо-дис-тый йе-мен-цу ка-ран-даш ка-пус-та клас-сна-я ком-пью-тер кас-трю-ля ку-куш-ка ко-ро-ва куз-не-чик кар-то-фель ком-на-та лас-точ-ка ля-гуш-ка ли-ли-я ли-ни-я ли-ней-ка лес-тни-ца ло-шад-ка лис-тья-ми лис-точ-ки лу-жай-ка ма-лень-кий мол-ни-я мат-рёш-ка мо-ло-ко му-равь-и мил-ли-он ма-га-зин му-ра-вей ма-ши-на нез-най-ка ни-ког-да не-нас-тье но-со-рог нав-стре-чу но-ут-бук на-у-ка об-ла-ко о-си-на о-сень-ю о-сен-ний о-го-род о-зе-ро о-во-щи о-кош-ко о-кунь-ки о-ку-ни пу-шис-тый пе-чень-е подъ-е-хал прек-рас-ный по-пу-гай плас-ти-лин прог-рам-ма пас-са-жир па-мят-ник под-снеж-ник ра-ди-о ро-маш-ка рес-то-ран ри-су-нок ре-бя-та ря-би-на ра-ду-га ра-ке-та ри-со-вать суб-бо-та сол-ныш-ко се-реб-ро сен-тяб-ря са-мо-лёт ска-мей-ка стре-ко-за счас-тли-вый со-ловь-и ско-ра-я трол-лей-бус та-рел-ка то-ва-рищ тёп-лы-е те-ле-фон трам-ва-и ти-ши-на тёп-ла-я у-ро-жай у-че-ник у-чи-тель у-лит-ка у-ли-ца у-лыб-ка у-доч-ка у-ро-ки у-голь-ки фи-ал-ка фло-мас-тер фут-бол-ка фун-кци-я фан-та-зёр фес-ти-валь фор-му-ла фран-цуз-ский фик-ци-я фор-ту-на хо-ро-ший хо-ро-шо хлопь-я-ми хо-зя-ин хо-ло-док храб-ры-е хо-лод-ный ха-риз-ма хок-ке-ист хо-зяй-ство цып-лё-нок цен-траль-ный цве-точ-ки це-поч-ка цы-поч-ка ци-лин-дра цу-на-ми ца-рев-на ци-лин-дре цып-ля-та чу-дес-ный че-ло-век чте-ни-е ча-со-вой че-мо-дан чу-де-са чёр-ны-е чер-ни-ла чув-ство-вать чи-тай-те школь-ни-ки школь-ны-е шо-ко-лад ши-пов-ник ше-лес-тит шес-тнад-цать шус-тры-е школь-ну-ю ши-ро-кий ще-кас-тый щу-рить-ся щу-паль-ца ще-но-чек щучь-е-му ща-ве-ля щу-ре-нок щу-рит-ся ще-пот-ка э-та-жи эс-ки-мо эс-ки-мос э-лек-трик эк-ва-тор э-лек-трон эс-тра-да эк-за-мен ю-ни-ор ю-ны-е ю-но-ша ю-боч-ка ю-би-лей юж-на-я ю-на-я яб-ло-ко я-го-да яб-ло-ня яб-лонь-ка я-гу-ар яр-ка-я яр-ки-е яр-мар-ка я-бе-да а-ка-ци-я ак-ку-рат-ный ак-ку-рат-но ав-то-мо-биль а-э-роп-лан ат-трак-ци-он ак-ва-ри-ум а-э-род-ром а-э-ро-порт бе-ло-рус-ский ба-ла-лай-ка бу-ду-ще-е бе-рё-зонь-ка бе-ло-ва-тый ба-на-но-вый бен-зи-но-вый бе-лос-неж-ный вос-кре-сень-е ве-ло-си-пед вы-со-ки-е вен-ти-ля-тор ве-ли-ча-вый вне-до-рож-ник во-робь-и-ный ви-се-ли-ца во-о-чи-ю вле-че-ни-е гу-се-ни-ца гид-рав-ли-ка го-су-дар-ство гла-ди-о-лус грам-ма-ти-ка га-ле-ре-я го-лу-бы-е гип-по-по-там ду-шис-ты-е до-маш-ня-я де-ревь-я-ми дож-дли-ва-я де-жур-ны-е де-я-тель-ность дви-же-ни-е дей-стви-тель-но дво-ю-род-ный е-же-ви-ка е-ло-вы-е е-жед-нев-ник е-ди-нич-ный е-ди-ни-ца ес-тес-твен-ный ес-тес-твен-но е-дин-ствен-ный ё-лоч-ны-е ё-лоч-на-я ё-лоч-ка-ми жи-вот-ны-е жи-вот-но-е жем-чу-жи-на жа-во-ро-нок же-лез-на-я же-ре-бё-нок жуж-жа-ни-е же-ла-ни-е жа-во-рон-ки жи-тель-ни-ца зем-ля-ни-ка зо-о-пар-ке зе-лё-на-я за-бас-тов-ка зе-лё-ны-е зо-ло-ты-е зас-ме-ял-ся за-кон-чи-лось за-би-я-ка за-да-ни-е ин-те-рес-но ис-то-ри-я и-де-аль-ный ил-лю-зи-я из-ви-ни-те ис-пу-га-ла ин-те-рес-ный йо-гур-тни-ца ко-ло-коль-чик кра-си-ва-я ка-ран-да-ши кол-лек-ци-я кос-ми-чес-кий ка-лей-дос-коп ко-ме-ди-я кра-си-ве-е кор-руп-ци-я лин-гвис-ти-ка ле-та-ю-щий лю-би-ма-я ла-тин-ско-го лис-твен-ни-ца лас-ко-вы-е лис-точ-ка-ми ли-ло-вы-е лас-ко-во-е ма-лень-ки-е мас-ле-ни-ца ма-лень-ка-я маг-ни-то-фон мил-ли-о-нер му-ра-вей-ник мед-ве-жо-нок мик-рос-хе-ма му-равь-иш-ка нас-то-я-щий нас-ту-пи-ла не-объ-ят-ный не-за-буд-ки не-воз-мож-но нож-ни-ца-ми на-до-е-ли на-у-чил-ся не-ва-ляш-ка о-безь-я-на о-де-я-ло о-хот-ни-ки ог-ром-ны-е о-ду-ван-чик о-те-чес-тво о-ран-же-вый о-сен-ни-е о-ру-жи-е от-вет-ствен-ность по-пу-га-и по-не-дель-ник при-е-ха-ли пу-шис-ты-е пи-а-ни-но по-я-ви-лись по-жа-луй-ста пу-шис-то-е по-э-зи-я поз-драв-ля-ю рас-те-ни-е ре-ше-ни-е разъ-я-рён-ный рас-те-ни-я рас-смат-ри-вать рос-си-я-нин рас-кра-си-ла рож-де-ни-я рес-пуб-ли-ка ро-ди-те-ли ско-во-ро-да сне-гу-роч-ка стро-и-те-ли сто-ло-ва-я сы-ро-еж-ка стро-и-тель-ство смо-ро-ди-на са-моз-ва-нец сте-че-ни-е те-ле-ви-зор те-лег-рам-ма тра-ди-ци-я тщес-ла-ви-е тра-ге-ди-я те-ле-ка-нал тре-у-голь-ник тор-жес-твен-ный тран-скрип-ци-я ук-ра-ин-ский у-мы-вать-ся у-ро-жа-и у-че-ни-я у-ха-жи-вать у-че-ни-ца у-че-ни-е ус-тро-и-ли у-час-тко-вый фа-ми-ли-я фа-миль-яр-ный фан-та-зи-я физ-куль-ту-ра фев-раль-ски-е фран-цуз-ско-го фан-тас-ти-ка фа-ми-ли-и хо-ло-диль-ник хо-лод-на-я хо-зяй-ствен-ный хо-да-тай-ство хо-ро-ша-я хло-пот-ли-вый хрис-ти-ан-ство хо-зя-и-на хо-зя-е-ва цве-точ-ни-ца цен-траль-на-я цеп-ля-ет-ся ца-ра-пи-на цве-точ-на-я це-леб-ны-е цве-точ-ну-ю цве-те-ни-е це-ло-вать-ся цел-лю-ло-за че-ре-па-ха чу-дес-на-я чу-дес-ны-е че-рё-му-ха чу-дес-но-е чу-до-ви-ще че-тыр-над-цать чи-ри-ка-ют шам-пан-ско-е ши-ро-ки-е шёл-ко-ва-я ши-ро-ка-я ши-пов-ни-ка шо-ко-лад-ный ши-пя-щи-е шо-ко-лад-ка ши-но-мон-таж щи-ко-лот-ка ща-ве-ле-вый ще-бе-та-ли ще-пе-тиль-ный щу-па-ни-е ще-ни-сты-е ще-кот-ли-вый ще-кот-ли-вость эк-скур-си-я эк-ска-ва-тор э-лек-трич-ка э-лек-тро-воз эс-ка-ла-тор э-та-жер-ка эф-фек-тив-ность эс-тон-ска-я э-лек-трон-ный ю-ро-ди-вый ю-би-лей-ный ю-рис-кон-сульт ю-но-шес-кий ю-мо-рес-ка ю-би-ля-ра ю-мо-рис-тка я-ще-ри-ца ян-тар-на-я я-иш-ни-ца яв-ле-ни-е яв-ля-ет-ся я-ич-ни-ца я-до-ви-тый я-пон-ски-е я-год-но-е ру-ка ре-ка ло-за лен-та фа-ра мо-ре ле-то зи-ма ча-сы си-то кар-та го-ра ле-на ма-ма лен-ка ко-ля со-ба-ка ру-ба-да но-сок тру-сы ве-сы до-мо-фон зиг-заг во-да кар-тош-ка тош-но-та де-ре-во ли-па ли-ра пра-га рос-ток до-ро-га пар-та ле-го во-лос бо-ро-да доб-ро ро-са ко-са ли-са пе-сок за-мок за-бор пе-ре-бор ши-на ко-ле-но па-па ра-ма со-лон-ка мо-ни-тор тор-моз лон-дон ро-бот бот-ва пра-лес ча-ща пар зи-на ре-зи-на ке-ро-син ки-но доб-ро-та док-тор док от-ра-же-ни-е лас-со лас-ка фа-соль мо-тор лес лес-ной мок-ро-та сок ку-сок ток ку-по-рос сук-но по-лот-но ку-ри-ца ца-ри-ца ку-ни-ца ка-ра-мель мар-ме-лад сне-го-пад пу-ля ду-ля мет-ла пи-ла соль мель ук-лад кам-не-пад чай ди-ван лам-па сте-на ме-тель за-ме-на ста-ди-он са-мо-кат бен-зо-воз де-пу-тат сор-няк на-вод-не-ни-у про-да-вец су-ма-то-ха ры-ба ры-бал-ка кру-го-зор об-зор за-ря ко-ря-га ма-ги-я ма-ри-я прос-тор ал-ко-голь го-ло-ва'
    .split(' ');

let demand = Object.entries(words.reduce((s, w) => { if (w in s) console.log('duplicate ' + w); else s[w] = true; return s }, {})).map(([k, _]) => k)
    .reduce((s, w) => { w.split('-').forEach(p => { if (p in s) s[p].words.push(w); else s[p] = { words: [w] } }); return s }, {})

let stat = Object.entries(demand).map(([p, { words }]) => [p, words.length]);
stat.sort(([_, a], [__, b]) => b - a);

//console.log(stat)
console.log('candidates', stat.filter(s => s[1] > 1 && !(s[0] in supply)).map(s => s[0]))
console.log('loners', stat.filter(s => s[1] == 1 && !(s[0] in supply)).map(s => s[0]))

const { on } = require('events');
const fs = require('fs');
const pth = require('path');
const http = require('node:https');
var querystring = require('node:querystring');


const url = 'https://slogi.su/word.json';



function post(url, word) {
    return new Promise((resolve, reject) => {
        let req = http.request(url, {
            method: 'POST', headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, res => {
            let response = ''

            console.log(res.statusCode)

            res.on('data', chunk => { console.log(chunk.toString()); response += chunk })
            res.on('end', () => {
                try {
                    resolve(JSON.parse(response))
                } catch (e) {
                    reject(e)
                }
            });
        });

        req.write(querystring.stringify({ 'q': word }));
        req.end();
    });
};

// const path = 'c:\\tmp';

// for (let file of fs.readdirSync(path)) {
//     let text = fs.readFileSync(pth.join(path, file)).toString().replace(/[()\[\]?«»!\r\n,.—<>]/g, ' ')
//         .replace(/\s+/, 's').split(' ')
//         .filter(s => s.length > 5 && !s.match(/[A-Za-z0-9]/g));

//     console.log(uniq(text).splice(3000));
// }

function uniq(words) {
    return Object.keys(words.reduce((s, w) => { if (!(w in s)) s[w] = true; return s }, {}))
}

