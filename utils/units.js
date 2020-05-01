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

// フィルタ状態
//  rare1 .. rare5 (レア度)
//  attr1 .. attr6 (属性)
const filter = {};
function filterUpdate() {
	let attr_all = 0;
	let rare_all = 0;
	for (let i = 1; i <= 6; i++) {
		filter[`rare${i}`] = $(`#rare${i}`).prop('checked');
		filter[`attr${i}`] = $(`#attr${i}`).prop('checked');
		rare_all += filter[`rare${i}`] ? 1 : 0;
		attr_all += filter[`attr${i}`] ? 1 : 0;
	}
	if (rare_all == 0) {
		for (let i = 1; i <= 6; i++) {
			filter[`rare${i}`] = true;
		}
	}
	if (attr_all == 0) {
		for (let i = 1; i <= 6; i++) {
			filter[`attr${i}`] = true;
		}
	}
	filter['level'] = $('input[name=status]:checked').val();
	filter['leader'] = $('#filter_ls').val();
}

// ユニット一覧の HTML を作り直す
function membersUpdate() {
	filterUpdate();
	//$('#project-icon').attr('src', blankGif);

	const $members = $('#members');
	$members.empty(); // 【要改造】毎度 .empty() はもったいないので display: none; タイプへ

	// メンバ一覧
	const members = [];
	for (let unit_id in savedata) { // unit_id で forEach
		let same_num = 0; // 【確認】same_num は member と同じになる気がする！
		const data = CD[unit_id];
		for (let member in savedata[unit_id]) { // 同じユニットを複数所持
			// ユニットID, 同ユニット連番, ユニットデータ, 育成状態
			// bug: マスタからキャラが削除された場合に ここで data == undefined になる！
			members.push([unit_id, same_num++, data, savedata[unit_id][member]]);
		}
	}

	// 表示用にソート (現在はゲームのユニット一覧での 属性 でソート相当)
	members.sort((a, b) => a[2][YD.ORDER] > b[2][YD.ORDER] ? 1 : a[2][YD.ORDER] < b[2][YD.ORDER] ? -1 : a[1] > b[1] ? 1 : -1);

	// フィルタ適用
	for (let i = 0; i < members.length; i++) {
		const data = members[i][2];

		// レア度 属性 フィルタに含まれていない
		if (!filter[`rare${data[YD.RARE]}`] || !filter[`attr${data[YD.ATTR]}`]) {
			continue;
		}

		const unit_id = data[YD.ID];
		const same_num = members[i][1];
		const detail = members[i][3]; // 各ユニットの育成状態 ( 1:レベル 2:限凸 3:未定 4:未定 )
		// bug: jQuery 内でキャッシュされてしまうので data-id と data-num は .data() ではなく .attr() で追加
		const $img = $('<img>').addClass('member_icon').attr('data-id', unit_id).attr('data-num', same_num).attr('title', data[YD.NAME]).attr("src", `${YD.SS_URL}${data[YD.SS_ID]}${YD.SS_EXT}`).attr('width', '110').attr('height', '110').on('error', function(){this.src = `${YD.SS_URL}00000${YD.SS_EXT}`});
		if (detail[0] >= 80) { // 育成しているユニット (レベル80以上)
			$img.addClass('member_icon_growth');
		}
		const $span = $('<span>')
			.addClass('unit_state') // 同時セットのハッシュ化 と .html() を使わない実装へ
			.css('font-size', 'small').css('display', $('#chkDispDetail').prop('checked') ? 'block' : 'none')
			.html(`<center>Lv:<span class="level">${detail[0]}</span> LS:<span class="skill">${detail[1]}</span> 装:<span class="equip">${detail[2]}</span></center>`);
		const $box = $('<div>').css('float', 'left').css('width', '125px').append($img).append('<br>').append($span);
		$members.append($box);
	}
	$members.append($('<div>').css('clear', 'both'));
}

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

// フォーカス当たったタイミングで、内部の文字列を選択状態に
$('#txtData').on('focus', function () {
	$(this).select();
});
// 表示フィルタ で設定している内容を 検索フィルタ にも適用させる
$('#search_with_filter').on('change', function () {
	// という設定状態を保存 ( localStorage['config'] に纏めたい )
	localStorage.setItem('selectfilter', $(this).prop('checked') ? "1" : "");
}).prop('checked', !!localStorage.getItem('selectfilter')); // 起動時にチェック状態を設定に同期

// メモ欄
$('#txtMemo').val(localStorage.getItem('memo'));
let timerMemoSave; // 自動保存タイマー
$('#txtMemo').on('input', function () {
	$('#btnMemoSave').prop('disabled', false);
	$(this).css('background-color', '#ffcccc');
	if (timerMemoSave) {
		clearTimeout(timerMemoSave);
	}
	timerMemoSave = setTimeout(() => { $('#btnMemoSave').trigger('click') }, 60 * 1000);
});
// メモ欄の保存ボタン
$('#btnMemoSave').on('click', function () {
	if (timerMemoSave) {
		clearTimeout(timerMemoSave);
	}
	localStorage.setItem('memo', $('#txtMemo').val());
	$('#txtMemo').css('background-color', '');
	$('#btnMemoSave').prop('disabled', true);
});

// 育成状態の表示スイッチ
$('#chkDispDetail').on('change', function () {
	$('.unit_state').css('display', $(this).prop('checked') ? 'block' : 'none');
});
// 育成状態を変更した場合の保存処理
$('select#level, select#skill, select#equip').on('change', (e) => {
	const $img = $('img.member_icon_selected')
	if ($img.length == 0) {
		return;
	}

	const $this = $(e.target);
	const elmId = $this.data('id');
	const offset = $this.data('offset');

	const unit_id = $img.data('id');
	const same_num = $img.data('num');

	const val = $this.val();
	$img.parent().find(`span.${elmId}`).text(val);

	if (offset == 0) { // Level:
		if (val > 1) {
			$img.addClass('member_icon_growth');
		} else {
			$img.removeClass('member_icon_growth');
		}
	}

	savedata[unit_id][same_num][offset] = parseInt(val);
	saveData();
});

// 表示フィルタ の状態を変更するタイミングで、ユニット一覧の表示を更新
$('input.filter_r, input.filter_t').on('change', function () {
	membersUpdate();
	$('#project-icon').attr('src', blankGif);
});

// ユニットの 追加、削除、進化 を更新ログとして記録 localStorage['history']
function UpdateLog(unit_id) {
	var history = JSON.parse(localStorage.getItem('history') || "[]");
	history.unshift([Math.floor(+new Date / 60000), unit_id]);
	localStorage.setItem('history', JSON.stringify(history.slice(0, 100)));
}
// ユニットの更新ログを表示
$('#btnHistory').on('click', function () {
	var history = JSON.parse(localStorage.getItem('history'));
	let txtLog = "";
	for (var i = 0; i < history.length; i++) {
		let dt = new Date(1970, 0, 1, 18, 0, 0); dt.setMinutes(parseInt(history[i][0]));
		const tm = dt.toISOString().replace(/(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.(\d\d\d)Z/, "$2/$3 $4:$5");
		const charaData = CD[Math.abs(history[i][1])];
		const name = `${" 炎氷風雷光闇".split("")[charaData[YD.ATTR]]}★${charaData[YD.RARE]} ${charaData[YD.NAME]}`;
		const action = history[i][1] > 0 ? "＋追加" : "－削除";
		txtLog += `${tm} に${action} ${name}\n`;
	}
	alert(txtLog);
});

// ユニット削除ボタン
$('#btnDelete').on('click', (e) => {
	const $img = $('img.member_icon_selected')
	if ($img.length == 0) {
		return;
	}
	const $this = $(e.target);

	const unit_id = $img.data('id');
	const same_num = $img.data('num');
	const same = savedata[unit_id];

	if (same[same_num][0] > 1 || same[same_num][1] > 1 || same[same_num][2] > 1) {
		alert(`選択したユニットを削除するには\n育成状態からレベル・Lスキル・装備枠を\n全て１に設定しなおして下さい`);
		return;
	}

	const data = CD[unit_id];
	const addMes = (savedata[unit_id].length >= 2) ? `\n　(${savedata[unit_id].length}体中のうち１体)` : "";
	if (!confirm(`★${data[YD.RARE]} ${data[YD.NAME]} を削除しますか？${addMes}`)) {
		return;
	}

	same.splice(same_num, 1);
	if (same.length == 0) {
		delete savedata[unit_id];
	}
	UpdateLog(unit_id * -1);
	saveData();
	membersUpdate();
});
// ユニット進化ボタン
$('#btnEvolution').on('click', (e) => {
	const $img = $('img.member_icon_selected')
	if ($img.length == 0) {
		return;
	}
	const $this = $(e.target);

	const unit_id = $img.data('id');
	const same_num = $img.data('num');
	const same = savedata[unit_id];

	const data = CD[unit_id];

	const nextData = data[YD.NEXT_ID];
	const nextId = nextData[YD.ID];

	if (nextId == unit_id) {
		alert(`★${data[YD.RARE]} ${data[YD.NAME]} は進化できません`);
		return;
	}

	if (!confirm(`★${data[YD.RARE]} ${data[YD.NAME]} を\n★${nextData[YD.RARE]} ${nextData[YD.NAME]} に進化させますか？`)) {
		return;
	}

	// キャラの削除
	same.splice(same_num, 1);
	if (same.length == 0) {
		delete savedata[unit_id];
	}
	// 進化キャラの追加
	if (savedata[nextId] == undefined) {
		savedata[nextId] = [];
	}
	savedata[nextId].push([1, 1, 1, 0]);
	saveData();

	UpdateLog(nextId);
	UpdateLog(unit_id * -1);

	alert(`★${data[YD.RARE]} ${data[YD.NAME]} を\n★${nextData[YD.RARE]} ${nextData[YD.NAME]} に進化させました`);

	// フィルタで非表示の場合
	const rare = nextData[YD.RARE];
	const attr = nextData[YD.ATTR];
	if (!filter[`rare${rare}`] || !filter[`attr${attr}`]) {
		alert(`フィルタにマッチしないので\n${nextData[YD.RARE]} ${nextData[YD.NAME]}\nは表示されません`);
		$('#btnDelete').prop('disabled', true);
	}

	membersUpdate();
	const nextNum = savedata[nextId].length - 1;
	$(`img.member_icon[data-id=${nextId}][data-num=${nextNum}]`).addClass('member_icon_selected');
});

// 動的に生成される HTML 上の onClick イベント補足
$(document).on('click', 'img.member_icon', function (e) {
	const $this = $(this);
	const $target = e.target;
	const unit_id = $this.data('id');
	const same_num = $this.data('num');
	const data = CD[unit_id];
	const detail = savedata[unit_id][same_num];

	$('select#level').val(detail[0]);
	$('select#skill').val(detail[1]);
	$('select#equip').val(detail[2]);
	$('#btnDelete').prop('disabled', false);

	$("#project").val(data[YD.NAME]);
	$("#project-icon").attr("src", `${YD.SS_URL}${data[YD.ID]}${YD.SS_EXT}`).on('error', function(){this.src = `${YD.SS_URL}00000${YD.SS_EXT}`});

	$('img.member_icon').removeClass('member_icon_selected');
	$this.addClass('member_icon_selected');
});

$('#project-icon').on('dblclick', function() {
	const $img = $('img.member_icon_selected')
	if ($img.length == 0) {
		return;
	}
	const unit_id = $img.data('id');
	const name = CD[unit_id][YD.NAME];
	if (confirm(`攻略Wikiで ${name} のページを開きますか？\n※ブラウザがポップアップブロックするかも`)) {
		window.open(`https://xn--jbkk0que.gamerch.com/${name}`, '_blank');
	}
});
// 動的に生成される HTML 上の onClick イベント補足
$(document).on('dblclick', 'img.member_icon', function (e) {
	const unit_id = $(this).data('id');
	const name = CD[unit_id][YD.NAME];
	if (confirm(`攻略Wikiで ${name} のページを開きますか？\n※ブラウザがポップアップブロックするかも`)) {
		window.open(`https://xn--jbkk0que.gamerch.com/${name}`, '_blank');
	}
});


// 検索窓フォーカス時に候補一覧表示
$("#project").on('focus', function () {
	$("#project").autocomplete("search");
});
// 検索窓の入力変更時に、空文字にした時点でユニット選択のアイコン削除
$("#project").on('input', function () {
	if ($("#project").val() == "") {
		$('#project-icon').attr('src', blankGif);
	}
});
// 検索窓からユニット検索 ～ 選択で追加
$("#project").autocomplete({
	minLength: 0,
	source: function (request, response) {
		// 【バグ】アルファベット( EX 接頭キャラ ) の挙動がおかしい
		const word = HanToZen(hiraToKana(request.term.toUpperCase().replace(/[ａ-ｚ]$/i, '')));
		//console.log(`search [${word}][length=${word.length}]`);
		if (word.length < 2) {
			//console.log(`done. [${word}] is empty`);
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
			// TODO: 空っぽの時にアイコン削除

			//SearchWords.forEach((i, v) => { if (i.word.indexOf(word) >= 0) { list.push(i) } });
			list.sort((a, b) => { a[0] < b[0] ? 1 : -1 });
			response(list);
			//console.log(`done. [${word}] length=${list.length}`);
		}
	},
	focus: function (event, ui) {
		//$("#project").val(ui.item.label);
		// TODO: 区別できるハイライト
		return false;
	},
	select: function (event, ui) {
		const unit_id = ui.item[YD.ID];
		const name = ui.item[YD.NAME];
		$("#project").val(name);
		$("#project-icon").attr("src", `${YD.SS_URL}${ui.item[YD.SS_ID]}${YD.SS_EXT}`).on('error', function(){this.src = `${YD.SS_URL}00000${YD.SS_EXT}`});

		const data = CD[unit_id];
		const rare = data[YD.RARE];
		const attr = data[YD.ATTR];

		if (!filter[`rare${rare}`] || !filter[`attr${attr}`]) {
			if (!confirm('フィルタにマッチしませんが追加しますか')) {
				return;
			}
			// サムネイルアイコンに member_icon_selected
			// Delete対応 (disabled)
			$('#btnDelete').prop('disabled', true);
		}

		$('select#level').val(1);
		$('select#skill').val(1);
		$('select#equip').val(1);

		if (savedata[unit_id] == undefined) {
			savedata[unit_id] = [];
		}
		savedata[unit_id].push([1, 1, 1, 0]);
		const same_num = savedata[unit_id].length - 1;
		saveData();
		membersUpdate();

		UpdateLog(unit_id);

		$('img.member_icon').removeClass('member_icon_selected');
		const img = $(`img.member_icon[data-id=${unit_id}][data-num=${same_num}]`).addClass('member_icon_selected').get(0);
		if (document.body.scrollIntoView) {
			setTimeout( img.scrollIntoView.bind(img, {behavior: "smooth", block: "center", inline: "center"}), 200 );
		}
		console.log(`img.member_icon[data-id=${unit_id}][data-num=${same_num}]`);

		$("#project").blur();
		return false;
	}
}).autocomplete("instance")._renderItem = function (ul, item) {
	const unit_id = item[YD.ID];
	const name = item[YD.NAME];
	return $("<li>") //【要改造】 .html() 使わない方式へ
		//.append(`<div><img class="chara-icon" src="${YD.SS_URL}${item[YD.SS_ID]}${YD.SS_EXT}"> ${name}</div>`)
		.append( $('<div>').append( $('<img>').attr("src", `${YD.SS_URL}${item[YD.SS_ID]}${YD.SS_EXT}`).on('error', function(){this.src = `${YD.SS_URL}00000${YD.SS_EXT}`}).addClass("chara-icon") ).append( $('<span>').text(" " + name) ) )
		.appendTo(ul);
};

// エントリポイント
//YURUDATA.get('https://yurutility.cf/data/201906-2', page_start());
function page_start() {
	createSearchWords();
	loadData();
	membersUpdate();
	if (CD[60605][YD.ORDER] != 60060365) {
		console.warn('【データ作成ミス】真闇の大魔導士ルーのソートIDが違う！');
	}
}

}
// ); // $(() => を外した
