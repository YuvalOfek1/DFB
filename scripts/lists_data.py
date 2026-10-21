"""Source of the built-in lists for every language. Run `python3 scripts/build_lists.py` to regenerate js/lists.js.

Lists keep the same ids in every language (celebrities, movies, travel, pictionary) so features such as the
free list work regardless of language. Content is chosen per culture, not translated word for word.
"""

# ---------------- Spanish ----------------

ES_INTL_CELEBS = [
    'Taylor Swift', 'Leonardo DiCaprio', 'Beyoncé', 'Tom Hanks', 'Rihanna', 'Brad Pitt', 'Lionel Messi',
    'Cristiano Ronaldo', 'Lady Gaga', 'Johnny Depp', 'Dwayne Johnson', 'Adele', 'Barack Obama', 'Angelina Jolie',
    'Elon Musk', 'Ed Sheeran', 'Michael Jordan', 'Justin Bieber', 'Ariana Grande', 'Keanu Reeves', 'Bill Gates',
    'Tom Cruise', 'Emma Watson', 'Billie Eilish', 'Jackie Chan', 'Madonna', 'Harry Styles', 'Usain Bolt',
    'Bruno Mars', 'Mark Zuckerberg', 'Eminem', 'Dua Lipa', 'Arnold Schwarzenegger', 'Steve Jobs',
    'Michael Jackson', 'Albert Einstein', 'Will Smith', 'Mr. Bean', 'Elton John', 'Paul McCartney',
    'Serena Williams', 'Kim Kardashian', 'Zendaya', 'Morgan Freeman', 'Margot Robbie', 'Jennifer Aniston',
    'Neymar', 'The Weeknd', 'Audrey Hepburn', 'Selena Gomez',
]
ES_SHARED_CELEBS = [
    'Shakira', 'Jennifer Lopez', 'Ricky Martin', 'Enrique Iglesias', 'Julio Iglesias', 'Salma Hayek',
    'Penélope Cruz', 'Antonio Banderas', 'Rafa Nadal', 'Bad Bunny', 'Rosalía', 'Karol G', 'Pedro Pascal',
    'Diego Maradona', 'Frida Kahlo', 'Gabriel García Márquez', 'Pablo Picasso', 'Salvador Dalí',
    'Javier Bardem', 'Guillermo del Toro', 'Luis Miguel', 'Daddy Yankee', 'J Balvin', 'Alejandro Sanz',
]
ES_ES_CELEBS = [
    'Fernando Alonso', 'Carlos Alcaraz', 'Andrés Iniesta', 'Iker Casillas', 'Sergio Ramos', 'Lamine Yamal',
    'Pedro Almodóvar', 'Lola Flores', 'Rocío Jurado', 'Raphael', 'David Bisbal', 'Aitana', 'Isabel Pantoja',
    'Pau Gasol', 'Marc Márquez', 'Miguel Induráin', 'Úrsula Corberó', 'Álvaro Morte', 'Mario Casas',
    'Ibai Llanos', 'El Rubius', 'Pablo Motos', 'David Broncano', 'Dani Martín', 'Quevedo', 'Fernando Torres',
]
ES_419_CELEBS = [
    'Chespirito', 'Vicente Fernández', 'Juan Gabriel', 'Selena Quintanilla', 'Celia Cruz', 'Carlos Santana',
    'Checo Pérez', 'Canelo Álvarez', 'Eugenio Derbez', 'Luis Fonsi', 'Peso Pluma', 'Natalia Lafourcade',
    'Gustavo Cerati', 'Susana Giménez', 'Pelé', 'Ronaldinho', 'James Rodríguez', 'Sofía Vergara',
    'Isabel Allende', 'Pablo Neruda', 'Jorge Luis Borges', 'Cantinflas', 'Pedro Infante', 'María Félix',
    'Thalía', 'Maluma',
]

# Western films whose Spanish title differs between Spain and Latin America: (Spain, Latin America)
ES_MOVIE_PAIRS = [
    ('El padrino', 'El padrino'), ('Titanic', 'Titanic'), ('Avatar', 'Avatar'),
    ('El caballero oscuro', 'Batman: El caballero de la noche'), ('Forrest Gump', 'Forrest Gump'),
    ('Parque Jurásico', 'Parque Jurásico'), ('Star Wars', 'Star Wars'), ('El rey león', 'El rey león'),
    ('Toy Story', 'Toy Story'), ('Matrix', 'Matrix'), ('Origen', 'El origen'),
    ('Frozen: El reino del hielo', 'Frozen: Una aventura congelada'), ('Buscando a Nemo', 'Buscando a Nemo'),
    ('Gladiator', 'Gladiador'), ('Regreso al futuro', 'Volver al futuro'), ('Cadena perpetua', 'Sueños de libertad'),
    ('Harry Potter', 'Harry Potter'), ('Shrek', 'Shrek'), ('Solo en casa', 'Mi pobre angelito'),
    ('Tiburón', 'Tiburón'), ('E.T., el extraterrestre', 'E.T., el extraterrestre'), ('Rocky', 'Rocky'),
    ('Pretty Woman', 'Mujer bonita'), ('Grease', 'Vaselina'), ('Top Gun', 'Top Gun'), ('Mamma Mia!', 'Mamma Mia!'),
    ('Los Vengadores', 'Los Vengadores'), ('Spider-Man', 'Spider-Man'), ('Iron Man', 'Iron Man'),
    ('Black Panther', 'Pantera Negra'), ('Barbie', 'Barbie'), ('Oppenheimer', 'Oppenheimer'),
    ('Interstellar', 'Interestelar'), ('La La Land', 'La La Land'), ('El diario de Noa', 'Diario de una pasión'),
    ('Chicas malas', 'Chicas pesadas'), ('Cazafantasmas', 'Los cazafantasmas'), ('Indiana Jones', 'Indiana Jones'),
    ('El mago de Oz', 'El mago de Oz'), ('Casablanca', 'Casablanca'), ('Psicosis', 'Psicosis'),
    ('Dirty Dancing', 'Baile caliente'), ('Ratatouille', 'Ratatouille'), ('Up', 'Up: Una aventura de altura'),
    ('Coco', 'Coco'), ('Vaiana', 'Moana'), ('Aladdín', 'Aladdín'), ('La bella y la bestia', 'La bella y la bestia'),
    ('La sirenita', 'La sirenita'), ('La Cenicienta', 'La Cenicienta'), ('Mulán', 'Mulán'),
    ('Madagascar', 'Madagascar'), ('Kung Fu Panda', 'Kung Fu Panda'), ('Gru, mi villano favorito', 'Mi villano favorito'),
    ('Cars', 'Cars'), ('Monstruos, S.A.', 'Monsters, Inc.'), ('Los increíbles', 'Los increíbles'),
    ('Del revés', 'Intensa-Mente'), ('Zootrópolis', 'Zootopia'), ('Encanto', 'Encanto'),
    ('Los juegos del hambre', 'Los juegos del hambre'), ('Crepúsculo', 'Crepúsculo'),
    ('A todo gas', 'Rápidos y furiosos'), ('Misión imposible', 'Misión imposible'), ('James Bond', 'James Bond'),
    ('Piratas del Caribe', 'Piratas del Caribe'), ('El señor de los anillos', 'El señor de los anillos'),
    ('Joker', 'Guasón'), ('Deadpool', 'Deadpool'), ('Wonder Woman', 'Mujer Maravilla'),
    ('El club de la lucha', 'El club de la pelea'), ('El silencio de los corderos', 'El silencio de los inocentes'),
    ('La lista de Schindler', 'La lista de Schindler'), ('Salvar al soldado Ryan', 'Rescatando al soldado Ryan'),
    ('El show de Truman', 'The Truman Show'), ('Atrapado en el tiempo', 'Hechizo del tiempo'),
    ('Men in Black', 'Hombres de negro'), ('Jungla de cristal', 'Duro de matar'),
    ('Sonrisas y lágrimas', 'La novicia rebelde'), ('Bohemian Rhapsody', 'Bohemian Rhapsody'),
    ('Jumanji', 'Jumanji'), ('Kill Bill', 'Kill Bill'), ('Señora Doubtfire', 'Papá por siempre'),
    ('Ghost', 'Ghost'),
]
ES_ES_FILMS = [
    'El laberinto del fauno', 'Volver', 'Todo sobre mi madre', 'Mar adentro', 'El orfanato', 'Los otros', 'REC',
    'Abre los ojos', 'Ocho apellidos vascos', 'Campeones', 'Torrente', 'El hoyo', 'La sociedad de la nieve',
    'Celda 211', 'Lo imposible', 'Mujeres al borde de un ataque de nervios', 'El día de la bestia',
]
ES_419_FILMS = [
    'Roma', 'Amores perros', 'Y tu mamá también', 'El secreto de sus ojos', 'Relatos salvajes', 'Nueve reinas',
    'Como agua para chocolate', 'Diarios de motocicleta', 'Ciudad de Dios', 'El laberinto del fauno',
    'No se aceptan devoluciones', 'Nosotros los Nobles', 'La sociedad de la nieve', 'Argentina, 1985',
    'Instrucciones no incluidas', 'El crimen del padre Amaro', 'Rudo y Cursi',
]

ES_COUNTRIES = [
    'Francia', 'Japón', 'Brasil', 'Italia', 'Australia', 'Canadá', 'México', 'Egipto', 'India', 'Grecia', 'España',
    'Tailandia', 'Islandia', 'Perú', 'Kenia', 'Noruega', 'Portugal', 'Argentina', 'Marruecos', 'Vietnam',
    'Nueva Zelanda', 'Suiza', 'Turquía', 'Irlanda', 'Sudáfrica', 'Indonesia', 'Croacia', 'Chile', 'Países Bajos',
    'Alemania', 'Cuba', 'Jamaica', 'Suecia', 'Austria', 'Bélgica', 'Dinamarca', 'Finlandia', 'Polonia',
    'República Checa', 'Hungría', 'China', 'Corea del Sur', 'Filipinas', 'Singapur', 'Malasia', 'Colombia',
    'Costa Rica', 'Ecuador', 'Bolivia', 'Tanzania', 'Madagascar', 'Jordania', 'Israel', 'Emiratos Árabes Unidos',
    'Nepal', 'Sri Lanka', 'Maldivas', 'Fiyi', 'Mongolia', 'Camboya',
]

ES_PICTIONARY = {
    'es-ES': ['Bicicleta', 'Piña', 'Faro', 'Volcán', 'Guitarra', 'Paraguas', 'Pingüino', 'Cohete', 'Muñeco de nieve',
              'Castillo', 'Elefante', 'Telescopio', 'Sirena', 'Hamaca', 'Tornado', 'Cactus', 'Pulpo', 'Monopatín',
              'Dragón', 'Cascada', 'Robot', 'Iglú', 'Canguro', 'Cofre del tesoro', 'Molino de viento', 'Telaraña',
              'Globo aerostático', 'Pirata', 'Unicornio', 'Tostadora'],
    'es-419': ['Bicicleta', 'Piña', 'Faro', 'Volcán', 'Guitarra', 'Paraguas', 'Pingüino', 'Cohete', 'Muñeco de nieve',
               'Castillo', 'Elefante', 'Telescopio', 'Sirena', 'Hamaca', 'Tornado', 'Cactus', 'Pulpo', 'Patineta',
               'Dragón', 'Cascada', 'Robot', 'Iglú', 'Canguro', 'Cofre del tesoro', 'Molino de viento', 'Telaraña',
               'Globo aerostático', 'Pirata', 'Unicornio', 'Tostador'],
}

ES_DECOYS = {
    'es-ES': [
        ('Lista de la compra', 1, ['Leche', 'Huevos', 'Pan de masa madre', 'Espinacas', 'Café en grano', 'Limones', 'Papel de cocina']),
        ('Ideas de regalos', 3, ['Mamá - libro de cocina / buen aceite de oliva', 'Dani - ¿juego de mesa?', 'Lucía - auriculares', '']),
        ('Wifi', 6, ['Red de casa - la contraseña está en la pegatina del router', 'Invitados: preguntar antes de compartir']),
        ('Libros por leer', 12, ['Cien años de soledad', 'La sombra del viento', 'Sapiens', 'El principito']),
        ('Maleta', 25, ['Pasaporte', 'Cargadores', 'Adaptador', 'Gafas de sol', 'Bañador', 'Libro']),
    ],
    'es-419': [
        ('Lista del súper', 1, ['Leche', 'Huevos', 'Pan', 'Espinacas', 'Café en grano', 'Limones', 'Toallas de papel']),
        ('Ideas de regalos', 3, ['Mamá - libro de cocina / buen aceite de oliva', 'Dani - ¿juego de mesa?', 'Lucía - audífonos', '']),
        ('Wifi', 6, ['Red de la casa - la contraseña está en la etiqueta del módem', 'Invitados: preguntar antes de compartir']),
        ('Libros por leer', 12, ['Cien años de soledad', 'Rayuela', 'Sapiens', 'El principito']),
        ('Maleta', 25, ['Pasaporte', 'Cargadores', 'Adaptador', 'Lentes de sol', 'Traje de baño', 'Libro']),
    ],
}

# ---------------- Japanese ----------------

JA_CELEBS = [
    # Japan
    '大谷翔平', 'イチロー', '木村拓哉', '宮崎駿', '北野武', '綾瀬はるか', '新垣結衣', '石原さとみ', '浜崎あゆみ',
    '宇多田ヒカル', '安室奈美恵', '羽生結弦', '大坂なおみ', '錦織圭', '明石家さんま', 'タモリ', '黒柳徹子',
    '渡辺直美', '米津玄師', '星野源', '福山雅治', '堺雅人', '阿部寛', '長澤まさみ', '広瀬すず', '橋本環奈',
    '菅田将暉', '小栗旬', '佐藤健', '有村架純', '松たか子', '二宮和也', '櫻井翔', '三浦知良', '本田圭佑',
    '中田英寿', '久保建英', '三笘薫', '井上尚弥', '八村塁', '浅田真央', '吉田沙保里', '内村航平', '藤井聡太',
    '孫正義', '草間彌生', '村上春樹', '坂本龍一', '久石譲', '手塚治虫', '鳥山明', '尾田栄一郎', '黒澤明',
    '新海誠', '渡辺謙', '真田広之', '浜辺美波', '今田美桜', '吉沢亮', 'あいみょん', '美空ひばり', '長嶋茂雄',
    '王貞治', '松岡修造', '池江璃花子',
    # International
    'テイラー・スウィフト', 'レオナルド・ディカプリオ', 'トム・クルーズ', 'ブラッド・ピット', 'ジョニー・デップ',
    'キアヌ・リーブス', 'レディー・ガガ', 'ビヨンセ', 'マイケル・ジャクソン', 'リオネル・メッシ',
    'クリスティアーノ・ロナウド', 'イーロン・マスク', 'ビル・ゲイツ', 'スティーブ・ジョブズ',
    'アルベルト・アインシュタイン', 'オードリー・ヘプバーン', 'ジャスティン・ビーバー', 'エド・シーラン',
    'アリアナ・グランデ', 'ビリー・アイリッシュ', 'エマ・ワトソン', 'ジャッキー・チェン', 'ミスター・ビーン',
    'マドンナ', 'エルトン・ジョン', 'ポール・マッカートニー', 'マイケル・ジョーダン', 'ウサイン・ボルト',
    'ロジャー・フェデラー', 'ブルーノ・マーズ', 'ドウェイン・ジョンソン', 'ウィル・スミス',
    'モーガン・フリーマン', 'ヒュー・ジャックマン', 'ジム・キャリー',
]

JA_MOVIES = [
    # Japanese films
    '千と千尋の神隠し', 'となりのトトロ', 'もののけ姫', '君の名は。', 'ハウルの動く城', '魔女の宅急便',
    '天空の城ラピュタ', '風の谷のナウシカ', '崖の上のポニョ', '火垂るの墓', '紅の豚', '君たちはどう生きるか',
    '天気の子', 'すずめの戸締まり', '七人の侍', '羅生門', '東京物語', 'ゴジラ', 'シン・ゴジラ', 'ゴジラ-1.0',
    '劇場版「鬼滅の刃」無限列車編', 'ドライブ・マイ・カー', 'おくりびと', '万引き家族', 'リング',
    'バトル・ロワイアル', 'AKIRA', 'THE FIRST SLAM DUNK', 'ONE PIECE FILM RED', '踊る大捜査線 THE MOVIE',
    '南極物語', '世界の中心で、愛をさけぶ', '電車男', '告白', '時をかける少女', 'サマーウォーズ',
    'おおかみこどもの雨と雪', '聲の形', 'ALWAYS 三丁目の夕日', '劇場版 呪術廻戦 0', '容疑者Xの献身',
    '君の膵臓をたべたい', '永遠の0',
    # Western films (Japanese release titles)
    'タイタニック', 'ゴッドファーザー', 'アバター', 'ダークナイト', 'フォレスト・ガンプ/一期一会',
    'ジュラシック・パーク', 'スター・ウォーズ', 'ライオン・キング', 'トイ・ストーリー', 'マトリックス',
    'インセプション', 'アナと雪の女王', 'ファインディング・ニモ', 'バック・トゥ・ザ・フューチャー',
    'ショーシャンクの空に', 'ハリー・ポッターと賢者の石', 'シュレック', 'ホーム・アローン', 'ジョーズ', 'E.T.',
    'ロッキー', 'プリティ・ウーマン', 'ターミネーター', 'トップガン', 'アベンジャーズ', 'スパイダーマン',
    'バービー', 'オッペンハイマー', 'インターステラー', 'ラ・ラ・ランド', 'ゴーストバスターズ',
    'インディ・ジョーンズ', 'オズの魔法使', 'カサブランカ', 'ローマの休日', 'ニュー・シネマ・パラダイス',
    'レインマン', 'レミーのおいしいレストラン', 'カールじいさんの空飛ぶ家', 'リメンバー・ミー', 'アラジン',
    '美女と野獣', 'リトル・マーメイド', 'モンスターズ・インク', 'インサイド・ヘッド', 'ズートピア',
    'ワイルド・スピード', 'ミッション:インポッシブル', 'パイレーツ・オブ・カリビアン', 'ロード・オブ・ザ・リング',
    'ジョーカー', '羊たちの沈黙', 'シンドラーのリスト', 'メン・イン・ブラック', 'アルマゲドン', 'ダイ・ハード',
    'サウンド・オブ・ミュージック', 'ボヘミアン・ラプソディ',
]

JA_COUNTRIES = [
    'フランス', 'アメリカ', 'ブラジル', 'イタリア', 'オーストラリア', 'カナダ', 'メキシコ', 'エジプト', 'インド',
    'ギリシャ', 'スペイン', 'タイ', 'アイスランド', 'ペルー', 'ケニア', 'ノルウェー', 'ポルトガル', 'アルゼンチン',
    'モロッコ', 'ベトナム', 'ニュージーランド', 'スイス', 'トルコ', 'アイルランド', '南アフリカ', 'インドネシア',
    'クロアチア', 'チリ', 'オランダ', 'ドイツ', 'キューバ', 'ジャマイカ', 'スウェーデン', 'オーストリア',
    'ベルギー', 'デンマーク', 'フィンランド', 'ポーランド', 'チェコ', 'ハンガリー', '中国', '韓国', 'フィリピン',
    'シンガポール', 'マレーシア', 'コロンビア', 'コスタリカ', 'エクアドル', 'ボリビア', 'タンザニア',
    'マダガスカル', 'ヨルダン', 'イスラエル', 'アラブ首長国連邦', 'ネパール', 'スリランカ', 'モルディブ',
    'フィジー', 'モンゴル', 'カンボジア',
]

JA_PICTIONARY = [
    '自転車', 'パイナップル', '灯台', '火山', 'ギター', '傘', 'ペンギン', 'ロケット', '雪だるま', 'お城', 'ゾウ',
    '望遠鏡', '人魚', 'ハンモック', '竜巻', 'サボテン', 'タコ', 'スケートボード', 'ドラゴン', '滝', 'ロボット',
    'かまくら', 'カンガルー', '宝箱', '風車', 'クモの巣', '熱気球', '海賊', 'ユニコーン', 'トースター',
]

JA_DECOYS = [
    ('買い物リスト', 1, ['牛乳', '卵', '食パン', 'ほうれん草', 'コーヒー豆', 'レモン', 'キッチンペーパー']),
    ('プレゼントのアイデア', 3, ['母 - 料理本 / 良いオリーブオイル', '父 - ボードゲーム?', '姉 - ヘッドホン', '']),
    ('Wi-Fi', 6, ['自宅のネットワーク - パスワードはルーターのシール', 'ゲスト用: 共有する前に確認']),
    ('読みたい本', 12, ['ノルウェイの森', '三体', 'サピエンス全史', '星の王子さま']),
    ('旅行の持ち物', 25, ['パスポート', '充電器', '変換プラグ', 'サングラス', '水着', '本']),
]
