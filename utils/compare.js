// 先に jQuery をロードしておくこと
// 先に data.js をロードしておくこと

const blankGif = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

// サポート関数 キャラ名フィルタ用の正規化 (カタカナ 全角 アルファベットは大文字)
function kanaToHira(str) {
	return str.replace(/[\u30A1-\u30F6]/g, s => String.fromCharCode(s.charCodeAt(0) - 0x60));
}
function hiraToKana(str) {
	return str.replace(/[\u3041-\u3096]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x60));
}
function HanToZen(str) {
	return str.replace(/[\uFF01-\uFF5E]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xFEE0));
}

// キャラ名フィルタ用のマップ
// SearchWords[ 正規化されたキャラ名 ] = キャラデータ
const SearchWords = [];
function createSearchWords()
{
	for (let unit_id in CD) {
		const word = HanToZen(hiraToKana( CD[unit_id][YD.NAME] )).toUpperCase();
		SearchWords[word] = CD[unit_id];
	}
}

const compareUnits = [ ];

// $(() => // <script> を <body> の最後に移動したので必要な DOM は既に使える
{

// 右クリック制限
$(document.body).on('contextmenu', (e) => {
	if (e.target.id == 'txtData')
		return true;
	if (e.target.id == 'txtMemo')
		return true;
	if (e.target.id == 'project')
		return true;
	return false;
});

// 文字列選択しちゃうの制限
$(document.body).on('selectstart', () => false);

const autocomplete_opt = {
	minLength: 0,
	source: function (request, response) {
		const word = HanToZen(hiraToKana(request.term.toUpperCase().replace(/[ａ-ｚ]$/i, '')));
		if (word.length < 2) {
			response([]);
			return;
		}
		else {
			const list = [];

			if ($('#search_with_filter').prop('checked')) {
				// TODO: フィルタ対応
				filterUpdate();
				for (let key in SearchWords) {
					if (key.indexOf(word) >= 0) {
						const data = SearchWords[key];
						const rare = data[YD.RARE];
						const attr = data[YD.ATTR];
						if (filter[`rare${rare}`] && filter[`attr${attr}`]) {
							list.push(SearchWords[key]);
						}
					}
				}
			}
			else {
				for (let key in SearchWords) {
					if (key.indexOf(word) >= 0) {
						list.push(SearchWords[key]);
					}
				}
			}
			list.sort((a, b) => { a[0] < b[0] ? 1 : -1 });
			response(list);
		}
	},
	focus: function (event, ui) {
		return false;
	},
	select: function (event, ui) {
		const unit_id = ui.item[YD.ID];
		$(this).val("");

		addUnit( unit_id );
		listAutoSave();

		return false;
	}
};

function addUnit( unit_id ) {
	const data = CD[unit_id];
	const rare = data[YD.RARE];
	const attr = data[YD.ATTR];

	const $table = $tmpl.clone().data('id', unit_id);

	$table.find(".unit_name").text( data[ YD.NAME ] );
	$table.find(".unit_hp") .text( data[ YD.HP ]  );
	$table.find(".unit_atk").text( data[ YD.ATK ] );
	$table.find(".unit_def").text( data[ YD.DEF ] );
	$table.find(".unit_spd").text( data[ YD.SPD ] );
	$table.find(".unit_acc").text( data[ YD.ACC ] );
	if (data[ YD.HP120 ] != 0) {
		$table.find(".unit_hp120") .text( '(' + data[ YD.HP120 ]  + ')').css( 'color', data[ YD.HP  ] == data[ YD.HP120  ] ? 'inherit' : 'red' );
		$table.find(".unit_atk120").text( '(' + data[ YD.ATK120 ] + ')').css( 'color', data[ YD.ATK ] == data[ YD.ATK120 ] ? 'inherit' : 'red' );
		$table.find(".unit_def120").text( '(' + data[ YD.DEF120 ] + ')').css( 'color', data[ YD.DEF ] == data[ YD.DEF120 ] ? 'inherit' : 'red' );
		$table.find(".unit_spd120").text( '(' + data[ YD.SPD120 ] + ')').css( 'color', data[ YD.SPD ] == data[ YD.SPD120 ] ? 'inherit' : 'red' );
		$table.find(".unit_acc120").text( '(' + data[ YD.ACC120 ] + ')').css( 'color', data[ YD.ACC ] == data[ YD.ACC120 ] ? 'inherit' : 'red' );
	}
	$table.find(".unit_skill2").text( data[ YD.SKILL2 ] ? data[ YD.SKILL2 ][ YD.NAME ] : "-" ).attr('title', data[ YD.SKILL2 ] ? `[${data[YD.SKILL2][YD.S_NAME]}]\n${data[YD.SKILL2][YD.S_DESC]}` : "" ).css('border-bottom', data[ YD.SKILL2 ] ? "dotted 1px #6699cc" : "" );
	$table.find(".unit_skill3").text( data[ YD.SKILL3 ] ? data[ YD.SKILL3 ][ YD.NAME ] : "-" ).attr('title', data[ YD.SKILL3 ] ? `[${data[YD.SKILL3][YD.S_NAME]}]\n${data[YD.SKILL3][YD.S_DESC]}` : "" ).css('border-bottom', data[ YD.SKILL3 ] ? "dotted 1px #6699cc" : "" );
	$table.find(".unit_skill4").text( data[ YD.SKILL4 ] ? data[ YD.SKILL4 ][ YD.NAME ] : "-" ).attr('title', data[ YD.SKILL4 ] ? `[${data[YD.SKILL4][YD.S_NAME]}]\n${data[YD.SKILL4][YD.S_DESC]}` : "" ).css('border-bottom', data[ YD.SKILL4 ] ? "dotted 1px #6699cc" : "" );
	$table.find(".unit_ls").text( data[YD.LS][YD.LS_KOUKA] ).attr('title', data[YD.LS][YD.ID] ? `[${data[YD.LS][YD.NAME]}]\n${data[YD.LS][YD.LS_DESC]}` : "" ).css('border-bottom', "dotted 1px #6699cc");

	$table.find(".unit_icon").attr("src", `${YD.SS_URL}${unit_id}${YD.SS_EXT}`).on('dblclick', function() { openWikiPage(data[YD.NAME]); return false; } );

	const $box = addBox(data[YD.NAME], $table).data('id', unit_id).css('height', tmpl_height + 40);
	$box.find('input[type=checkbox]').prop('checked', true).on('change', function(){ $box.remove(); listAutoSave(); })
	$box.on('drag', listAutoSave);

	return $box;
}

function openWikiPage(name) {
	if (confirm(`攻略Wikiで ${name} のページを開きますか？\n※ブラウザがポップアップブロックするかも`)) {
		window.open(`https://xn--jbkk0que.gamerch.com/${name}`, '_blank');
	}
}

let timerListSave; // 自動保存タイマー
function listAutoSave() {
	if (timerListSave) {
		clearTimeout(timerListSave);
	}
	timerListSave = setTimeout(() => {
		localStorage.setItem('compare_units', JSON.stringify( $('#basePanel').find('div.ui-widget-content:has(input[type=checkbox])').map((i,v) => [ [$(v).data('id'), $(v).css('left'), $(v).css('top') ] ]).get() ) );
	}, 2 * 1000);
}

// 検索窓からユニット検索 ～ 選択で追加
const $searchBox = $("#search_unit");
$searchBox
.on('focus', function () {
	$(this).autocomplete("search");
})
.on('input', function () {
	if ($(this).val() == "") {
		$('#project-icon').attr('src', blankGif);
	}
})
.autocomplete( autocomplete_opt ).autocomplete("instance")._renderItem = function (ul, item) {
	const unit_id = item[YD.ID];
	const name = item[YD.NAME];
	return $("<li>")
		.append( $('<div>').append( $('<img>').attr("src", `${YD.SS_URL}${item[YD.SS_ID]}${YD.SS_EXT}`).addClass("chara-icon") ).append( $('<span>').text(" " + name) ) )
		.appendTo(ul);
};

// 雛形
const $tmpl = $('table#tmpl').removeAttr('id');
let tmpl_height = 0;

// エントリポイント
//YURUDATA.get('https://yurutility.download/data/201906-2', page_start());
function page_start() {
	createSearchWords();

	tmpl_height = $tmpl.height();
	$tmpl.remove().show();
	console.log( tmpl_height );

	const jsoned = localStorage.getItem('compare_units');
	if (jsoned) {
		JSON.parse(jsoned).forEach(v => {
			addUnit( v[0] ).css('left', v[1]).css('top', v[2]);
		});
	}

	if (CD[60605][YD.ORDER] != 60060365) {
		console.warn('【データ作成ミス】真闇の大魔導士ルーのソートIDが違う！');
	}
}

}
// ); // $(() => を外した
