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

# ---------------- Shared international names (Latin script) ----------------
# Used by French, German, Italian and Portuguese, each adding its own local stars first.
INTL_LATIN = [
    'Taylor Swift', 'Leonardo DiCaprio', 'Beyoncé', 'Tom Hanks', 'Rihanna', 'Brad Pitt', 'Lionel Messi',
    'Cristiano Ronaldo', 'Lady Gaga', 'Johnny Depp', 'Dwayne Johnson', 'Adele', 'Barack Obama', 'Angelina Jolie',
    'Elon Musk', 'Ed Sheeran', 'Michael Jordan', 'Justin Bieber', 'Ariana Grande', 'Keanu Reeves', 'Bill Gates',
    'Tom Cruise', 'Emma Watson', 'Billie Eilish', 'Jackie Chan', 'Madonna', 'Harry Styles', 'Usain Bolt',
    'Bruno Mars', 'Mark Zuckerberg', 'Eminem', 'Dua Lipa', 'Arnold Schwarzenegger', 'Steve Jobs',
    'Michael Jackson', 'Albert Einstein', 'Will Smith', 'Mr. Bean', 'Elton John', 'Paul McCartney',
    'Serena Williams', 'Kim Kardashian', 'Zendaya', 'Morgan Freeman', 'Margot Robbie', 'Shakira', 'Neymar',
    'Audrey Hepburn', 'Selena Gomez', 'Charlie Chaplin', 'Roger Federer', 'Rafael Nadal', 'Jennifer Lopez',
]

# Western films as (French, German, Italian, Brazilian Portuguese) release titles.
WESTERN_FILMS_EU = [
    ('Le Parrain', 'Der Pate', 'Il padrino', 'O Poderoso Chefão'),
    ('Titanic', 'Titanic', 'Titanic', 'Titanic'),
    ('Avatar', 'Avatar', 'Avatar', 'Avatar'),
    ('The Dark Knight', 'The Dark Knight', 'Il cavaliere oscuro', 'Batman: O Cavaleiro das Trevas'),
    ('Forrest Gump', 'Forrest Gump', 'Forrest Gump', 'Forrest Gump'),
    ('Jurassic Park', 'Jurassic Park', 'Jurassic Park', 'Jurassic Park'),
    ('Star Wars', 'Krieg der Sterne', 'Guerre stellari', 'Star Wars'),
    ('Le Roi lion', 'Der König der Löwen', 'Il re leone', 'O Rei Leão'),
    ('Toy Story', 'Toy Story', 'Toy Story', 'Toy Story'),
    ('Matrix', 'Matrix', 'Matrix', 'Matrix'),
    ('Inception', 'Inception', 'Inception', 'A Origem'),
    ('La Reine des neiges', 'Die Eiskönigin', 'Frozen – Il regno di ghiaccio', 'Frozen: Uma Aventura Congelante'),
    ('Le Monde de Nemo', 'Findet Nemo', 'Alla ricerca di Nemo', 'Procurando Nemo'),
    ('Gladiator', 'Gladiator', 'Il gladiatore', 'Gladiador'),
    ('Retour vers le futur', 'Zurück in die Zukunft', 'Ritorno al futuro', 'De Volta para o Futuro'),
    ('Les Évadés', 'Die Verurteilten', 'Le ali della libertà', 'Um Sonho de Liberdade'),
    ('Harry Potter', 'Harry Potter', 'Harry Potter', 'Harry Potter'),
    ('Shrek', 'Shrek', 'Shrek', 'Shrek'),
    ('Maman, j’ai raté l’avion', 'Kevin – Allein zu Haus', 'Mamma, ho perso l’aereo', 'Esqueceram de Mim'),
    ('Les Dents de la mer', 'Der weiße Hai', 'Lo squalo', 'Tubarão'),
    ('E.T. l’extra-terrestre', 'E.T. – Der Außerirdische', 'E.T. l’extra-terrestre', 'E.T.: O Extraterrestre'),
    ('Rocky', 'Rocky', 'Rocky', 'Rocky'),
    ('Pretty Woman', 'Pretty Woman', 'Pretty Woman', 'Uma Linda Mulher'),
    ('Grease', 'Grease', 'Grease', 'Grease'),
    ('Terminator', 'Terminator', 'Terminator', 'O Exterminador do Futuro'),
    ('Top Gun', 'Top Gun', 'Top Gun', 'Top Gun'),
    ('Avengers', 'The Avengers', 'Avengers', 'Os Vingadores'),
    ('Spider-Man', 'Spider-Man', 'Spider-Man', 'Homem-Aranha'),
    ('Iron Man', 'Iron Man', 'Iron Man', 'Homem de Ferro'),
    ('Black Panther', 'Black Panther', 'Black Panther', 'Pantera Negra'),
    ('Barbie', 'Barbie', 'Barbie', 'Barbie'),
    ('Oppenheimer', 'Oppenheimer', 'Oppenheimer', 'Oppenheimer'),
    ('Interstellar', 'Interstellar', 'Interstellar', 'Interestelar'),
    ('La La Land', 'La La Land', 'La La Land', 'La La Land'),
    ('N’oublie jamais', 'Wie ein einziger Tag', 'Le pagine della nostra vita', 'Diário de uma Paixão'),
    ('SOS Fantômes', 'Ghostbusters', 'Ghostbusters', 'Os Caça-Fantasmas'),
    ('Indiana Jones', 'Indiana Jones', 'Indiana Jones', 'Indiana Jones'),
    ('Le Magicien d’Oz', 'Der Zauberer von Oz', 'Il mago di Oz', 'O Mágico de Oz'),
    ('Casablanca', 'Casablanca', 'Casablanca', 'Casablanca'),
    ('Psychose', 'Psycho', 'Psyco', 'Psicose'),
    ('Rain Man', 'Rain Man', 'Rain Man', 'Rain Man'),
    ('Dirty Dancing', 'Dirty Dancing', 'Dirty Dancing', 'Dirty Dancing'),
    ('Ratatouille', 'Ratatouille', 'Ratatouille', 'Ratatouille'),
    ('Là-haut', 'Oben', 'Up', 'Up: Altas Aventuras'),
    ('Coco', 'Coco', 'Coco', 'Viva: A Vida é uma Festa'),
    ('Vaiana', 'Vaiana', 'Oceania', 'Moana'),
    ('Aladdin', 'Aladdin', 'Aladdin', 'Aladdin'),
    ('La Belle et la Bête', 'Die Schöne und das Biest', 'La bella e la bestia', 'A Bela e a Fera'),
    ('La Petite Sirène', 'Arielle, die Meerjungfrau', 'La sirenetta', 'A Pequena Sereia'),
    ('Cendrillon', 'Cinderella', 'Cenerentola', 'Cinderela'),
    ('Mulan', 'Mulan', 'Mulan', 'Mulan'),
    ('Madagascar', 'Madagascar', 'Madagascar', 'Madagascar'),
    ('Kung Fu Panda', 'Kung Fu Panda', 'Kung Fu Panda', 'Kung Fu Panda'),
    ('Moi, moche et méchant', 'Ich – Einfach unverbesserlich', 'Cattivissimo me', 'Meu Malvado Favorito'),
    ('Cars', 'Cars', 'Cars', 'Carros'),
    ('Monstres et Cie', 'Die Monster AG', 'Monsters & Co.', 'Monstros S.A.'),
    ('Les Indestructibles', 'Die Unglaublichen', 'Gli Incredibili', 'Os Incríveis'),
    ('Vice-versa', 'Alles steht Kopf', 'Inside Out', 'Divertida Mente'),
    ('Zootopie', 'Zoomania', 'Zootropolis', 'Zootopia'),
    ('Encanto', 'Encanto', 'Encanto', 'Encanto'),
    ('Hunger Games', 'Die Tribute von Panem', 'Hunger Games', 'Jogos Vorazes'),
    ('Twilight', 'Twilight', 'Twilight', 'Crepúsculo'),
    ('Fast and Furious', 'Fast & Furious', 'Fast & Furious', 'Velozes e Furiosos'),
    ('Mission impossible', 'Mission: Impossible', 'Mission: Impossible', 'Missão: Impossível'),
    ('Pirates des Caraïbes', 'Fluch der Karibik', 'Pirati dei Caraibi', 'Piratas do Caribe'),
    ('Le Seigneur des anneaux', 'Der Herr der Ringe', 'Il Signore degli Anelli', 'O Senhor dos Anéis'),
    ('Joker', 'Joker', 'Joker', 'Coringa'),
    ('Fight Club', 'Fight Club', 'Fight Club', 'Clube da Luta'),
    ('Le Silence des agneaux', 'Das Schweigen der Lämmer', 'Il silenzio degli innocenti', 'O Silêncio dos Inocentes'),
    ('La Liste de Schindler', 'Schindlers Liste', 'Schindler’s List', 'A Lista de Schindler'),
    ('Il faut sauver le soldat Ryan', 'Der Soldat James Ryan', 'Salvate il soldato Ryan', 'O Resgate do Soldado Ryan'),
    ('The Truman Show', 'Die Truman Show', 'The Truman Show', 'O Show de Truman'),
    ('Men in Black', 'Men in Black', 'Men in Black', 'MIB: Homens de Preto'),
    ('Armageddon', 'Armageddon', 'Armageddon', 'Armageddon'),
    ('Piège de cristal', 'Stirb langsam', 'Trappola di cristallo', 'Duro de Matar'),
    ('La Mélodie du bonheur', 'Meine Lieder – meine Träume', 'Tutti insieme appassionatamente', 'A Noviça Rebelde'),
    ('Bohemian Rhapsody', 'Bohemian Rhapsody', 'Bohemian Rhapsody', 'Bohemian Rhapsody'),
    ('Jumanji', 'Jumanji', 'Jumanji', 'Jumanji'),
    ('Ghost', 'Ghost – Nachricht von Sam', 'Ghost', 'Ghost: Do Outro Lado da Vida'),
    ('Madame Doubtfire', 'Mrs. Doubtfire', 'Mrs. Doubtfire', 'Uma Babá Quase Perfeita'),
    ('Un jour sans fin', 'Und täglich grüßt das Murmeltier', 'Ricomincio da capo', 'Feitiço do Tempo'),
]

# ---------------- French ----------------
FR_CELEBS = [
    'Kylian Mbappé', 'Zinédine Zidane', 'Thierry Henry', 'Antoine Griezmann', 'Omar Sy', 'Jean Dujardin',
    'Marion Cotillard', 'Audrey Tautou', 'Jean Reno', 'Sophie Marceau', 'Catherine Deneuve', 'Brigitte Bardot',
    'Édith Piaf', 'Johnny Hallyday', 'Charles Aznavour', 'Serge Gainsbourg', 'Céline Dion', 'Stromae',
    'Aya Nakamura', 'Angèle', 'Mylène Farmer', 'Jul', 'Gims', 'Louane', 'Indila', 'David Guetta', 'Daft Punk',
    'Teddy Riner', 'Tony Parker', 'Victor Wembanyama', 'Léon Marchand', 'Antoine Dupont', 'Kev Adams',
    'Jamel Debbouze', 'Gad Elmaleh', 'Dany Boon', 'Christian Clavier', 'Louis de Funès', 'Coluche',
    'Napoléon Bonaparte', 'Marie Curie', 'Victor Hugo', 'Coco Chanel', 'Thomas Pesquet', 'Squeezie',
    'Léa Seydoux', 'Vincent Cassel', 'Juliette Binoche', 'Timothée Chalamet', 'Karim Benzema',
]
FR_FILMS = [
    'Intouchables', 'Le Fabuleux Destin d’Amélie Poulain', 'Bienvenue chez les Ch’tis', 'Les Visiteurs',
    'La Grande Vadrouille', 'Le Dîner de cons', 'Astérix et Obélix : Mission Cléopâtre', 'Les Choristes',
    'La Haine', 'Léon', 'Le Grand Bleu', 'Le Cinquième Élément', 'Taxi', 'Qu’est-ce qu’on a fait au Bon Dieu ?',
    'Le Père Noël est une ordure', 'OSS 117 : Le Caire, nid d’espions', 'The Artist', 'Les Bronzés',
    'Les Tontons flingueurs', 'Les Trois Frères', 'La Cité de la peur', 'Le Corniaud',
]
FR_COUNTRIES = [
    'États-Unis', 'Japon', 'Brésil', 'Italie', 'Australie', 'Canada', 'Mexique', 'Égypte', 'Inde', 'Grèce',
    'Espagne', 'Thaïlande', 'Islande', 'Pérou', 'Kenya', 'Norvège', 'Portugal', 'Argentine', 'Maroc', 'Vietnam',
    'Nouvelle-Zélande', 'Suisse', 'Turquie', 'Irlande', 'Afrique du Sud', 'Indonésie', 'Croatie', 'Chili',
    'Pays-Bas', 'Allemagne', 'Cuba', 'Jamaïque', 'Suède', 'Autriche', 'Belgique', 'Danemark', 'Finlande',
    'Pologne', 'République tchèque', 'Hongrie', 'Chine', 'Corée du Sud', 'Philippines', 'Singapour', 'Malaisie',
    'Colombie', 'Costa Rica', 'Équateur', 'Bolivie', 'Tanzanie', 'Madagascar', 'Jordanie', 'Israël',
    'Émirats arabes unis', 'Népal', 'Sri Lanka', 'Maldives', 'Fidji', 'Mongolie', 'Cambodge',
]
FR_PICTIONARY = [
    'Vélo', 'Ananas', 'Phare', 'Volcan', 'Guitare', 'Parapluie', 'Pingouin', 'Fusée', 'Bonhomme de neige',
    'Château', 'Éléphant', 'Télescope', 'Sirène', 'Hamac', 'Tornade', 'Cactus', 'Pieuvre', 'Skateboard',
    'Dragon', 'Cascade', 'Robot', 'Igloo', 'Kangourou', 'Coffre au trésor', 'Moulin à vent', 'Toile d’araignée',
    'Montgolfière', 'Pirate', 'Licorne', 'Grille-pain',
]
FR_DECOYS = [
    ('Courses', 1, ['Lait', 'Œufs', 'Pain au levain', 'Épinards', 'Café en grains', 'Citrons', 'Essuie-tout']),
    ('Idées cadeaux', 3, ['Maman - livre de cuisine / bonne huile d’olive', 'Dan - jeu de société ?', 'Noa - casque audio', '']),
    ('Wifi', 6, ['Réseau maison - mot de passe sur l’étiquette de la box', 'Invités : demander avant de partager']),
    ('Livres à lire', 12, ['L’Étranger', 'Le Petit Prince', 'Sapiens', 'Les Misérables']),
    ('Valise', 25, ['Passeport', 'Chargeurs', 'Adaptateur', 'Lunettes de soleil', 'Maillot de bain', 'Livre']),
]

# ---------------- German ----------------
DE_CELEBS = [
    'Thomas Müller', 'Manuel Neuer', 'Toni Kroos', 'Jamal Musiala', 'Florian Wirtz', 'Franz Beckenbauer',
    'Bastian Schweinsteiger', 'Lukas Podolski', 'Jürgen Klopp', 'Michael Schumacher', 'Sebastian Vettel',
    'Boris Becker', 'Steffi Graf', 'Dirk Nowitzki', 'Til Schweiger', 'Daniel Brühl', 'Diane Kruger',
    'Christoph Waltz', 'Sandra Hüller', 'Matthias Schweighöfer', 'Elyas M’Barek', 'Heidi Klum',
    'Claudia Schiffer', 'Karl Lagerfeld', 'Helene Fischer', 'Herbert Grönemeyer', 'Udo Lindenberg', 'Nena',
    'Rammstein', 'Tokio Hotel', 'Mark Forster', 'Lena Meyer-Landrut', 'Apache 207', 'Peter Maffay',
    'Dieter Bohlen', 'Thomas Gottschalk', 'Stefan Raab', 'Joko Winterscheidt', 'Klaas Heufer-Umlauf',
    'Barbara Schöneberger', 'Günther Jauch', 'Hape Kerkeling', 'Otto Waalkes', 'Michael Bully Herbig',
    'Loriot', 'Ludwig van Beethoven', 'Johann Sebastian Bach', 'Wolfgang Amadeus Mozart', 'Felix Lobrecht',
    'Harry Kane',
]
DE_FILMS = [
    'Das Boot', 'Good Bye, Lenin!', 'Lola rennt', 'Das Leben der Anderen', 'Der Schuh des Manitu',
    'Fack ju Göhte', 'Keinohrhasen', 'Die Welle', 'Der Untergang', 'Im Westen nichts Neues', 'Toni Erdmann',
    'Die unendliche Geschichte', 'Sissi', 'Das Wunder von Bern', 'Honig im Kopf', 'Otto – Der Film',
    '(T)Raumschiff Surprise', 'Das Experiment', 'Victoria', 'Systemsprenger', 'Werner – Beinhart!',
]
DE_COUNTRIES = [
    'Frankreich', 'Japan', 'Brasilien', 'Italien', 'Australien', 'Kanada', 'Mexiko', 'Ägypten', 'Indien',
    'Griechenland', 'Spanien', 'Thailand', 'Island', 'Peru', 'Kenia', 'Norwegen', 'Portugal', 'Argentinien',
    'Marokko', 'Vietnam', 'Neuseeland', 'Schweiz', 'Türkei', 'Irland', 'Südafrika', 'Indonesien', 'Kroatien',
    'Chile', 'Niederlande', 'USA', 'Kuba', 'Jamaika', 'Schweden', 'Österreich', 'Belgien', 'Dänemark',
    'Finnland', 'Polen', 'Tschechien', 'Ungarn', 'China', 'Südkorea', 'Philippinen', 'Singapur', 'Malaysia',
    'Kolumbien', 'Costa Rica', 'Ecuador', 'Bolivien', 'Tansania', 'Madagaskar', 'Jordanien', 'Israel',
    'Vereinigte Arabische Emirate', 'Nepal', 'Sri Lanka', 'Malediven', 'Fidschi', 'Mongolei', 'Kambodscha',
]
DE_PICTIONARY = [
    'Fahrrad', 'Ananas', 'Leuchtturm', 'Vulkan', 'Gitarre', 'Regenschirm', 'Pinguin', 'Rakete', 'Schneemann',
    'Burg', 'Elefant', 'Teleskop', 'Meerjungfrau', 'Hängematte', 'Tornado', 'Kaktus', 'Krake', 'Skateboard',
    'Drache', 'Wasserfall', 'Roboter', 'Iglu', 'Känguru', 'Schatztruhe', 'Windmühle', 'Spinnennetz',
    'Heißluftballon', 'Pirat', 'Einhorn', 'Toaster',
]
DE_DECOYS = [
    ('Einkaufsliste', 1, ['Milch', 'Eier', 'Sauerteigbrot', 'Spinat', 'Kaffeebohnen', 'Zitronen', 'Küchenrolle']),
    ('Geschenkideen', 3, ['Mama - Kochbuch / gutes Olivenöl', 'Dan - Brettspiel?', 'Noa - Kopfhörer', '']),
    ('WLAN', 6, ['Heimnetz - Passwort steht auf dem Aufkleber am Router', 'Gäste: vorher fragen']),
    ('Bücher zum Lesen', 12, ['Der Vorleser', 'Die unendliche Geschichte', 'Sapiens', 'Der Steppenwolf']),
    ('Packliste', 25, ['Reisepass', 'Ladekabel', 'Adapter', 'Sonnenbrille', 'Badesachen', 'Buch']),
]

# ---------------- Italian ----------------
IT_CELEBS = [
    'Valentino Rossi', 'Francesco Totti', 'Roberto Baggio', 'Alessandro Del Piero', 'Gianluigi Buffon',
    'Paolo Maldini', 'Andrea Pirlo', 'Jannik Sinner', 'Federica Pellegrini', 'Marcell Jacobs', 'Bebe Vio',
    'Sophia Loren', 'Monica Bellucci', 'Roberto Benigni', 'Marcello Mastroianni', 'Federico Fellini', 'Totò',
    'Alberto Sordi', 'Checco Zalone', 'Paola Cortellesi', 'Pierfrancesco Favino', 'Laura Pausini',
    'Eros Ramazzotti', 'Andrea Bocelli', 'Luciano Pavarotti', 'Vasco Rossi', 'Adriano Celentano', 'Jovanotti',
    'Tiziano Ferro', 'Måneskin', 'Annalisa', 'Elodie', 'Mahmood', 'Gianni Morandi', 'Mina', 'Raffaella Carrà',
    'Fiorello', 'Gerry Scotti', 'Maria De Filippi', 'Carlo Conti', 'Amadeus', 'Paolo Bonolis',
    'Leonardo da Vinci', 'Michelangelo', 'Giorgio Armani', 'Donatella Versace', 'Enzo Ferrari',
    'Chiara Ferragni', 'Fedez', 'Zucchero',
]
IT_FILMS = [
    'La vita è bella', 'Nuovo Cinema Paradiso', 'La dolce vita', 'Il buono, il brutto, il cattivo',
    'La grande bellezza', 'Perfetti sconosciuti', 'Quo vado?', 'Il postino', 'Mediterraneo',
    'Ladri di biciclette', 'Il sorpasso', 'Benvenuti al Sud', 'Tre uomini e una gamba', 'Fantozzi',
    'Amici miei', 'C’era una volta il West', 'Chiamami col tuo nome', 'Il Divo', 'Smetto quando voglio',
    'Lo chiamavano Jeeg Robot', 'C’è ancora domani',
]
IT_COUNTRIES = [
    'Francia', 'Giappone', 'Brasile', 'Stati Uniti', 'Australia', 'Canada', 'Messico', 'Egitto', 'India',
    'Grecia', 'Spagna', 'Thailandia', 'Islanda', 'Perù', 'Kenya', 'Norvegia', 'Portogallo', 'Argentina',
    'Marocco', 'Vietnam', 'Nuova Zelanda', 'Svizzera', 'Turchia', 'Irlanda', 'Sudafrica', 'Indonesia', 'Croazia',
    'Cile', 'Paesi Bassi', 'Germania', 'Cuba', 'Giamaica', 'Svezia', 'Austria', 'Belgio', 'Danimarca',
    'Finlandia', 'Polonia', 'Repubblica Ceca', 'Ungheria', 'Cina', 'Corea del Sud', 'Filippine', 'Singapore',
    'Malesia', 'Colombia', 'Costa Rica', 'Ecuador', 'Bolivia', 'Tanzania', 'Madagascar', 'Giordania', 'Israele',
    'Emirati Arabi Uniti', 'Nepal', 'Sri Lanka', 'Maldive', 'Figi', 'Mongolia', 'Cambogia',
]
IT_PICTIONARY = [
    'Bicicletta', 'Ananas', 'Faro', 'Vulcano', 'Chitarra', 'Ombrello', 'Pinguino', 'Razzo', 'Pupazzo di neve',
    'Castello', 'Elefante', 'Telescopio', 'Sirena', 'Amaca', 'Tornado', 'Cactus', 'Polpo', 'Skateboard', 'Drago',
    'Cascata', 'Robot', 'Igloo', 'Canguro', 'Forziere', 'Mulino a vento', 'Ragnatela', 'Mongolfiera', 'Pirata',
    'Unicorno', 'Tostapane',
]
IT_DECOYS = [
    ('Spesa', 1, ['Latte', 'Uova', 'Pane', 'Spinaci', 'Caffè in grani', 'Limoni', 'Carta da cucina']),
    ('Idee regalo', 3, ['Mamma - libro di cucina / olio buono', 'Dan - gioco da tavolo?', 'Noa - cuffie', '']),
    ('Wi-Fi', 6, ['Rete di casa - password sull’etichetta del modem', 'Ospiti: chiedere prima di condividere']),
    ('Libri da leggere', 12, ['Il nome della rosa', 'L’amica geniale', 'Sapiens', 'Il piccolo principe']),
    ('Valigia', 25, ['Passaporto', 'Caricabatterie', 'Adattatore', 'Occhiali da sole', 'Costume', 'Libro']),
]

# ---------------- Portuguese (Brazil) ----------------
PT_CELEBS = [
    'Pelé', 'Ronaldinho', 'Ronaldo Fenômeno', 'Kaká', 'Romário', 'Zico', 'Vinícius Júnior', 'Marta',
    'Ayrton Senna', 'Rebeca Andrade', 'Gustavo Kuerten', 'Anitta', 'Ivete Sangalo', 'Xuxa', 'Gisele Bündchen',
    'Alessandra Ambrosio', 'Wagner Moura', 'Rodrigo Santoro', 'Fernanda Montenegro', 'Fernanda Torres',
    'Selton Mello', 'Lázaro Ramos', 'Taís Araújo', 'Tony Ramos', 'Faustão', 'Silvio Santos', 'Ana Maria Braga',
    'Luciano Huck', 'Whindersson Nunes', 'Felipe Neto', 'Paulo Gustavo', 'Roberto Carlos', 'Caetano Veloso',
    'Gilberto Gil', 'Chico Buarque', 'Tom Jobim', 'Elis Regina', 'Rita Lee', 'Marília Mendonça',
    'Gusttavo Lima', 'Luan Santana', 'Ludmilla', 'Pabllo Vittar', 'Jorge Ben Jor', 'Seu Jorge', 'Casimiro',
    'Galvão Bueno', 'Oscar Niemeyer', 'Paulo Coelho', 'Machado de Assis',
]
PT_FILMS = [
    'Cidade de Deus', 'Central do Brasil', 'Tropa de Elite', 'O Auto da Compadecida', 'Que Horas Ela Volta?',
    'Bacurau', 'Ainda Estou Aqui', 'Minha Mãe é uma Peça', 'Se Eu Fosse Você', 'Carandiru',
    '2 Filhos de Francisco', 'O Pagador de Promessas', 'Lisbela e o Prisioneiro', 'De Pernas pro Ar',
    'Tropa de Elite 2', 'Cine Holliúdy', 'O Palhaço', 'Hoje Eu Quero Voltar Sozinho', 'Meu Nome Não é Johnny',
]
PT_COUNTRIES = [
    'França', 'Japão', 'Estados Unidos', 'Itália', 'Austrália', 'Canadá', 'México', 'Egito', 'Índia', 'Grécia',
    'Espanha', 'Tailândia', 'Islândia', 'Peru', 'Quênia', 'Noruega', 'Portugal', 'Argentina', 'Marrocos',
    'Vietnã', 'Nova Zelândia', 'Suíça', 'Turquia', 'Irlanda', 'África do Sul', 'Indonésia', 'Croácia', 'Chile',
    'Países Baixos', 'Alemanha', 'Cuba', 'Jamaica', 'Suécia', 'Áustria', 'Bélgica', 'Dinamarca', 'Finlândia',
    'Polônia', 'República Tcheca', 'Hungria', 'China', 'Coreia do Sul', 'Filipinas', 'Singapura', 'Malásia',
    'Colômbia', 'Costa Rica', 'Equador', 'Bolívia', 'Tanzânia', 'Madagascar', 'Jordânia', 'Israel',
    'Emirados Árabes Unidos', 'Nepal', 'Sri Lanka', 'Maldivas', 'Fiji', 'Mongólia', 'Camboja',
]
PT_PICTIONARY = [
    'Bicicleta', 'Abacaxi', 'Farol', 'Vulcão', 'Violão', 'Guarda-chuva', 'Pinguim', 'Foguete', 'Boneco de neve',
    'Castelo', 'Elefante', 'Telescópio', 'Sereia', 'Rede', 'Tornado', 'Cacto', 'Polvo', 'Skate', 'Dragão',
    'Cachoeira', 'Robô', 'Iglu', 'Canguru', 'Baú do tesouro', 'Moinho de vento', 'Teia de aranha',
    'Balão de ar quente', 'Pirata', 'Unicórnio', 'Torradeira',
]
PT_DECOYS = [
    ('Lista de mercado', 1, ['Leite', 'Ovos', 'Pão', 'Espinafre', 'Café em grãos', 'Limões', 'Papel toalha']),
    ('Ideias de presente', 3, ['Mãe - livro de receitas / azeite bom', 'Dan - jogo de tabuleiro?', 'Noa - fone de ouvido', '']),
    ('Wi-Fi', 6, ['Rede de casa - senha na etiqueta do roteador', 'Visitas: perguntar antes de passar']),
    ('Livros pra ler', 12, ['Dom Casmurro', 'O Alquimista', 'Sapiens', 'O Pequeno Príncipe']),
    ('Mala', 25, ['Passaporte', 'Carregadores', 'Adaptador', 'Óculos de sol', 'Roupa de banho', 'Livro']),
]

# ---------------- Hebrew ----------------
HE_CELEBS = [
    # Israel
    'גל גדות', 'נטע ברזילי', 'עומר אדם', 'אייל גולן', 'שרית חדד', 'נועה קירל', 'סטטיק ובן אל', 'עדן בן זקן',
    'אסי עזר', 'ליאור רז', 'בר רפאלי', 'שלמה ארצי', 'אריק איינשטיין', 'עפרה חזה', 'זהבה בן', 'יהודה לוי',
    'אסי כהן', 'גורי אלפי', 'רותם סלע', 'עומרי כספי', 'דני אבדיה', 'אהוד בנאי', 'אביב גפן', 'ריטה', 'מוש בן ארי',
    'טונה', 'אליעד', 'שירי מימון', 'יונית לוי', 'רן דנקר', 'צביקה הדר', 'אורנה בנאי', 'אלי פיניש', 'דודו טסה',
    'יוסי בניון', 'ערן זהבי', 'יובל נח הררי', 'נטלי פורטמן', 'עדי הימלבלאו', 'שלום חנוך', 'ירדנה ארזי',
    'חיים טופול', 'יעל בר זוהר', 'מאיר בנאי', 'הדג נחש', 'עידן רייכל', 'קובי פרג', 'מרגלית צנעני',
    'עברי לידר', 'אגם בוחבוט',
    # International
    'טיילור סוויפט', 'לאונרדו דיקפריו', 'ביונסה', 'טום הנקס', 'ריהאנה', 'בראד פיט', 'ליונל מסי',
    'כריסטיאנו רונאלדו', 'ליידי גאגא', 'ג׳וני דפ', 'דוויין ג׳ונסון', 'אדל', 'ברק אובמה', 'אנג׳לינה ג׳ולי',
    'אילון מאסק', 'אד שירן', 'מייקל ג׳ורדן', 'ג׳סטין ביבר', 'אריאנה גרנדה', 'קיאנו ריבס', 'ביל גייטס', 'טום קרוז',
    'אמה ווטסון', 'בילי אייליש', 'ג׳קי צ׳אן', 'מדונה', 'הארי סטיילס', 'יוסיין בולט', 'ברונו מארס',
    'מארק צוקרברג', 'אמינם', 'דואה ליפה', 'ארנולד שוורצנגר', 'סטיב ג׳ובס', 'מייקל ג׳קסון', 'אלברט איינשטיין',
    'וויל סמית׳', 'מיסטר בין', 'אלטון ג׳ון', 'פול מקרטני', 'סרינה ויליאמס', 'קים קרדשיאן', 'זנדאיה',
    'מורגן פרימן', 'מרגו רובי', 'שאקירה', 'אדם סנדלר', 'אודרי הפבורן', 'סלינה גומז', 'צ׳רלי צ׳פלין',
]
HE_MOVIES = [
    # Israeli films
    'גבעת חלפון אינה עונה', 'אסקימו לימון', 'מבצע סבתא', 'ביקור התזמורת', 'ואלס עם באשיר', 'בופור', 'לבנון',
    'הערת שוליים', 'פוקסטרוט', 'סאלח שבתי', 'קזבלן', 'חגיגה בסנוקר', 'אלכס חולה אהבה', 'הלהקה',
    'סוף העולם שמאלה', 'הבועה', 'כנפיים שבורות',
    # International films (Hebrew release titles)
    'טיטאניק', 'הסנדק', 'אווטאר', 'האביר האפל', 'פורסט גאמפ', 'פארק היורה', 'מלחמת הכוכבים', 'מלך האריות',
    'צעצוע של סיפור', 'מטריקס', 'התחלה', 'לשבור את הקרח', 'מוצאים את נמו', 'גלדיאטור', 'בחזרה לעתיד',
    'חומות של תקווה', 'הארי פוטר', 'שרק', 'שכחו אותי בבית', 'מלתעות', 'אי.טי.', 'רוקי', 'אישה יפה', 'גריז',
    'שליחות קטלנית', 'טופ גאן', 'הנוקמים', 'ספיידרמן', 'איירון מן', 'הפנתר השחור', 'ברבי', 'אופנהיימר',
    'בין כוכבים', 'לה לה לנד', 'מכסחי השדים', 'אינדיאנה ג׳ונס', 'הקוסם מארץ עוץ', 'קזבלנקה', 'פסיכו',
    'איש הגשם', 'ריקוד מושחת', 'רטטוי', 'למעלה', 'קוקו', 'מואנה', 'אלדין', 'היפה והחיה', 'בת הים הקטנה',
    'סינדרלה', 'מולאן', 'מדגסקר', 'קונג פו פנדה', 'גנוב על הירח', 'מכוניות', 'מפלצות בע״מ', 'משפחת סופר-על',
    'הקול בראש', 'זוטרופוליס', 'אנקנטו', 'משחקי הרעב', 'דמדומים', 'מהיר ועצבני', 'משימה בלתי אפשרית',
    'שודדי הקריביים', 'שר הטבעות', 'ג׳וקר', 'מועדון קרב', 'שתיקת הכבשים', 'רשימת שינדלר', 'להציל את טוראי ראיין',
    'המופע של טרומן', 'גברים בשחור', 'ארמגדון', 'מת לחיות', 'צלילי המוזיקה', 'רפסודיה בוהמית', 'ג׳ומנג׳י',
    'רוח רפאים', 'גברת דאוטפייר', 'קפטן אמריקה', 'הסוכן 007', 'טרמינל', 'וול-אי', 'דדפול', 'וונדר וומן', 'ספר הג׳ונגל',
]
HE_COUNTRIES = [
    'צרפת', 'יפן', 'ברזיל', 'איטליה', 'אוסטרליה', 'קנדה', 'מקסיקו', 'מצרים', 'הודו', 'יוון', 'ספרד', 'תאילנד',
    'איסלנד', 'פרו', 'קניה', 'נורווגיה', 'פורטוגל', 'ארגנטינה', 'מרוקו', 'וייטנאם', 'ניו זילנד', 'שווייץ',
    'טורקיה', 'אירלנד', 'דרום אפריקה', 'אינדונזיה', 'קרואטיה', 'צ׳ילה', 'הולנד', 'גרמניה', 'קובה', 'ג׳מייקה',
    'שוודיה', 'אוסטריה', 'בלגיה', 'דנמרק', 'פינלנד', 'פולין', 'צ׳כיה', 'הונגריה', 'סין', 'דרום קוריאה',
    'הפיליפינים', 'סינגפור', 'מלזיה', 'קולומביה', 'קוסטה ריקה', 'אקוודור', 'בוליביה', 'טנזניה', 'מדגסקר',
    'ירדן', 'ארצות הברית', 'איחוד האמירויות', 'נפאל', 'סרי לנקה', 'האיים המלדיביים', 'פיג׳י', 'מונגוליה',
    'קמבודיה',
]
HE_PICTIONARY = [
    'אופניים', 'אננס', 'מגדלור', 'הר געש', 'גיטרה', 'מטרייה', 'פינגווין', 'טיל', 'איש שלג', 'טירה', 'פיל',
    'טלסקופ', 'בת ים', 'ערסל', 'טורנדו', 'קקטוס', 'תמנון', 'סקייטבורד', 'דרקון', 'מפל', 'רובוט', 'איגלו',
    'קנגורו', 'תיבת אוצר', 'טחנת רוח', 'קורי עכביש', 'כדור פורח', 'פיראט', 'חד-קרן', 'טוסטר',
]
HE_DECOYS = [
    ('קניות', 1, ['חלב', 'ביצים', 'לחם מחמצת', 'תרד', 'פולי קפה', 'לימונים', 'נייר סופג']),
    ('רעיונות למתנות', 3, ['אמא - ספר מתכונים / שמן זית טוב', 'דן - משחק קופסה?', 'נועה - אוזניות', '']),
    ('WiFi', 6, ['הרשת בבית - הסיסמה על המדבקה של הראוטר', 'אורחים: לשאול לפני ששולחים']),
    ('ספרים לקרוא', 12, ['סיפור על אהבה וחושך', 'קיצור תולדות האנושות', 'הנסיך הקטן', 'מלכוד 22']),
    ('ציוד לטיסה', 25, ['דרכון', 'מטענים', 'מתאם', 'משקפי שמש', 'בגד ים', 'ספר']),
]

# ---------------- Korean ----------------
KO_CELEBS = [
    # Korea
    '손흥민', '김연아', '방탄소년단', '블랙핑크', '아이유', '송강호', '이병헌', '공유', '현빈', '손예진', '전지현',
    '송혜교', '박서준', '이민호', '김수현', '수지', '박찬욱', '봉준호', '유재석', '강호동', '싸이', '지드래곤',
    '태연', '정국', '지민', '제니', '리사', '로제', '지수', '뉴진스', '류현진', '박지성', '이강인', '김민재',
    '추신수', '김연경', '이정재', '윤여정', '마동석', '정호연', '하정우', '이효리', '비', '보아', '임영웅',
    '백종원', '페이커', '차은우', '김태리', '박보검',
    # International
    '테일러 스위프트', '레오나르도 디카프리오', '비욘세', '톰 행크스', '리한나', '브래드 피트', '리오넬 메시',
    '크리스티아누 호날두', '레이디 가가', '조니 뎁', '드웨인 존슨', '아델', '버락 오바마', '안젤리나 졸리',
    '일론 머스크', '에드 시런', '마이클 조던', '저스틴 비버', '아리아나 그란데', '키아누 리브스', '빌 게이츠',
    '톰 크루즈', '엠마 왓슨', '빌리 아일리시', '성룡', '마돈나', '해리 스타일스', '우사인 볼트', '브루노 마스',
    '마크 저커버그', '에미넴', '아놀드 슈워제네거', '스티브 잡스', '마이클 잭슨', '알베르트 아인슈타인',
    '윌 스미스', '미스터 빈', '엘튼 존', '폴 매카트니', '모건 프리먼', '오드리 헵번', '찰리 채플린',
    '오타니 쇼헤이', '셀레나 고메즈', '마고 로비', '젠데이아', '샤키라', '네이마르', '로저 페더러', '두아 리파',
]
KO_MOVIES = [
    # Korean films
    '기생충', '올드보이', '부산행', '괴물', '살인의 추억', '명량', '극한직업', '신과함께', '국제시장', '베테랑',
    '암살', '범죄도시', '태극기 휘날리며', '왕의 남자', '7번방의 선물', '택시운전사', '1987', '헤어질 결심',
    '아가씨', '곡성', '광해, 왕이 된 남자', '도둑들', '해운대', '친구', '실미도', '엽기적인 그녀', '클래식',
    '건축학개론', '써니', '과속스캔들', '파묘', '서울의 봄', '한산: 용의 출현', '엑시트',
    # International films (Korean release titles)
    '타이타닉', '대부', '아바타', '다크 나이트', '포레스트 검프', '쥬라기 공원', '스타워즈', '라이온 킹',
    '토이 스토리', '매트릭스', '인셉션', '겨울왕국', '니모를 찾아서', '글래디에이터', '백 투 더 퓨처', '쇼생크 탈출',
    '해리 포터', '슈렉', '나 홀로 집에', '죠스', 'E.T.', '록키', '귀여운 여인', '터미네이터', '탑건', '어벤져스',
    '스파이더맨', '아이언맨', '블랙 팬서', '바비', '오펜하이머', '인터스텔라', '라라랜드', '노트북',
    '고스트버스터즈', '인디아나 존스', '오즈의 마법사', '카사블랑카', '레인 맨', '라따뚜이', '업', '코코',
    '모아나', '알라딘', '미녀와 야수', '인어공주', '신데렐라', '뮬란', '쿵푸 팬더', '슈퍼배드', '몬스터 주식회사',
    '인크레더블', '인사이드 아웃', '주토피아', '엔칸토', '헝거게임', '트와일라잇', '분노의 질주', '미션 임파서블',
    '캐리비안의 해적', '반지의 제왕', '조커', '양들의 침묵', '쉰들러 리스트', '라이언 일병 구하기', '트루먼 쇼',
    '맨 인 블랙', '아마겟돈', '다이 하드', '사운드 오브 뮤직', '보헤미안 랩소디', '쥬만지', '사랑과 영혼',
    '로마의 휴일', '센과 치히로의 행방불명', '너의 이름은.',
]
KO_COUNTRIES = [
    '프랑스', '일본', '브라질', '이탈리아', '호주', '캐나다', '멕시코', '이집트', '인도', '그리스', '스페인', '태국',
    '아이슬란드', '페루', '케냐', '노르웨이', '포르투갈', '아르헨티나', '모로코', '베트남', '뉴질랜드', '스위스',
    '튀르키예', '아일랜드', '남아프리카 공화국', '인도네시아', '크로아티아', '칠레', '네덜란드', '독일', '쿠바',
    '자메이카', '스웨덴', '오스트리아', '벨기에', '덴마크', '핀란드', '폴란드', '체코', '헝가리', '중국', '미국',
    '필리핀', '싱가포르', '말레이시아', '콜롬비아', '코스타리카', '에콰도르', '볼리비아', '탄자니아',
    '마다가스카르', '요르단', '이스라엘', '아랍에미리트', '네팔', '스리랑카', '몰디브', '피지', '몽골', '캄보디아',
]
KO_PICTIONARY = [
    '자전거', '파인애플', '등대', '화산', '기타', '우산', '펭귄', '로켓', '눈사람', '성', '코끼리', '망원경', '인어',
    '해먹', '토네이도', '선인장', '문어', '스케이트보드', '용', '폭포', '로봇', '이글루', '캥거루', '보물상자', '풍차',
    '거미줄', '열기구', '해적', '유니콘', '토스터',
]
KO_DECOYS = [
    ('장보기', 1, ['우유', '계란', '식빵', '시금치', '원두', '레몬', '키친타월']),
    ('선물 아이디어', 3, ['엄마 - 요리책 / 좋은 올리브유', '아빠 - 보드게임?', '누나 - 헤드폰', '']),
    ('와이파이', 6, ['집 와이파이 - 비밀번호는 공유기 스티커', '손님용: 공유 전에 확인']),
    ('읽을 책', 12, ['채식주의자', '아몬드', '사피엔스', '어린 왕자']),
    ('여행 짐', 25, ['여권', '충전기', '어댑터', '선글라스', '수영복', '책']),
]
