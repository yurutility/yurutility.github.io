(() => {
	function $make_tr(chara_data, same_data){
		// 名前枠を 限凸 状態や 最大Lv や リーダースキル や 装備枠解放 の状態で変化
		const $td_name = $('<td>')
			.css('background-color', same_data[0] >= 100 ? '#ccccff' : '')
			.css('color', same_data[1] > 1 ? '#f00' : '')
			.css('text-overflow', 'ellipsis')
			.css('white-space', 'nowrap')
			.css('overflow', 'hidden')
			//.css('max-width', '0');
			.data('id', chara_data[YD.ID])
			.on('dblclick', openWikiPage)
			.on('mouseover', mouseOver)
			.on('mouseout', mouseOut)
			.append( $('<span>').addClass('chara_name').text(chara_data[YD.NAME]) );
		const $tr = $('<tr>')
				.append($td_name)
				//.append($('<td>').text(same_data[3]).css('text-align', 'right'))
				//.append($('<td>').text(same_data[4]).css('text-align', 'right'))
				//.append($('<td>').text(same_data[5]).css('text-align', 'right'));
		return $tr;
	}

	function 回復系スキル() {
		const LS_TOP = ['単ヒール', '全ヒール', 'リジェネ', 'ディスペル', 'リカバリ'];
		const LS_TOP_MAP = {}; LS_TOP.forEach((v, i) => { LS_TOP_MAP[v] = i })

		// 表を作る (縦:リーダースキル / 横:属性) の中に (ユニット名,★3,★4,★5 のリスト表)
		const $tbody_list = [[], [], [], [], [], [], []];
		for (let idx = 0; idx < LS_TOP.length; idx++) {
			for (let i = 1; i < YD.ATTR_J.length; i++) {
				const title = `${YD.ATTR_J[i]} ${LS_TOP[idx]}`;
				const $_table = $('<table>').attr('border', '1').attr('cellspacing', "0").attr('width', '100%').css('border-color', '#eee').attr('cellpadding', "0").css("font-size", "small");
				// .css('table-layout', 'fixed') 失敗
				const $_tbody = $('<tbody>').appendTo($_table);
				$tbody_list[i][idx] = $_tbody;
				const $box = addBox(title, $_table);
				$box
					.css('width', '250px').css('left', `${(i-1)*250}px`)
					.css('height', '180px').css('top', `${idx*180 +30}px`);
				$box.find('div.box_cotent').css('overflow-y', 'scroll');
			}
		}

		// 所持キャラを振り分け
		const CheckColumn = [ 8, 9, 10, 11 ];
		Object.keys(chkSame1).forEach((unit_id, i) => {
			const chara_data = CD[unit_id];
			const same_data = chkSame1[unit_id];
			CheckColumn.forEach(column => {
				//if (chara_data[column] && LS_TOP_MAP[chara_data[column][0]] >= 0) {
				//	$make_tr(chara_data, same_data).appendTo($tbody_list[chara_data[4]][LS_TOP_MAP[chara_data[column][0]]]);
				//}
				if (chara_data[column]) {
					//if (LS_TOP_MAP[chara_data[column][0]] >= 0) {
					//	$make_tr(chara_data, same_data).appendTo($tbody_list[chara_data[4]][LS_TOP_MAP[chara_data[column][0]]]);
					//}
					LS_TOP.forEach((v,i) => {
						if (chara_data[column][1].indexOf(v) >= 0) {
							const $tr = $make_tr(chara_data, same_data).appendTo($tbody_list[chara_data[4]][i]);
							const $span = $tr.find('span.chara_name').attr('title', `[${column-7}:${chara_data[column][1]}]\n${chara_data[column][2]}`);
							$span.text(`${column-7}:${$span.text()}`);
						}
					})
				}
			});
		});
	}

	function バフスキル() {
		const LS_TOP = ['攻+', '防+', '早+'];
		const LS_TOP_MAP = {}; LS_TOP.forEach((v, i) => { LS_TOP_MAP[v] = i })

		// 表を作る (縦:リーダースキル / 横:属性) の中に (ユニット名,★3,★4,★5 のリスト表)
		const $tbody_list = [[], [], [], [], [], [], []];
		for (let idx = 0; idx < LS_TOP.length; idx++) {
			for (let i = 1; i < YD.ATTR_J.length; i++) {
				const title = `${YD.ATTR_J[i]} ${LS_TOP[idx]}`;
				const $_table = $('<table>').attr('border', '1').attr('cellspacing', "0").attr('width', '100%').css('border-color', '#eee').attr('cellpadding', "0").css("font-size", "small");
				// .css('table-layout', 'fixed') 失敗
				const $_tbody = $('<tbody>').appendTo($_table);
				$tbody_list[i][idx] = $_tbody;
				const $box = addBox(title, $_table);
				$box
					.css('width', '250px').css('left', `${(i-1)*250}px`)
					.css('height', '180px').css('top', `${idx*180 +30}px`);
				$box.find('div.box_cotent').css('overflow-y', 'scroll');
			}
		}

		// 所持キャラを振り分け
		const CheckColumn = [ 9, 10, 11 ];
		Object.keys(chkSame1).forEach((unit_id, i) => {
			const chara_data = CD[unit_id];
			const same_data = chkSame1[unit_id];

			CheckColumn.forEach(column => {
				if (chara_data[column]) {
					//if (LS_TOP_MAP[chara_data[column][0]] >= 0) {
					//	$make_tr(chara_data, same_data).appendTo($tbody_list[chara_data[4]][LS_TOP_MAP[chara_data[column][0]]]);
					//}
					LS_TOP.forEach((v,i) => {
						if (chara_data[column][1].indexOf(v) >= 0) {
							const $tr = $make_tr(chara_data, same_data).appendTo($tbody_list[chara_data[4]][i]);
							const $span = $tr.find('span.chara_name').attr('title', `[${column-7}:${chara_data[column][1]}]\n${chara_data[column][2]}`);
							$span.text(`${column-7}:${$span.text()}`);
						}
					})
				}
			});
		});
	}

	function デバフスキル() {
		const LS_TOP = ['攻-', '防-', '早-'];
		const LS_TOP_MAP = {}; LS_TOP.forEach((v, i) => { LS_TOP_MAP[v] = i })

		// 表を作る (縦:リーダースキル / 横:属性) の中に (ユニット名,★3,★4,★5 のリスト表)
		const $tbody_list = [[], [], [], [], [], [], []];
		for (let idx = 0; idx < LS_TOP.length; idx++) {
			for (let i = 1; i < YD.ATTR_J.length; i++) {
				const title = `${YD.ATTR_J[i]} ${LS_TOP[idx]}`;
				const $_table = $('<table>').attr('border', '1').attr('cellspacing', "0").attr('width', '100%').css('border-color', '#eee').attr('cellpadding', "0").css("font-size", "small");
				// .css('table-layout', 'fixed') 失敗
				const $_tbody = $('<tbody>').appendTo($_table);
				$tbody_list[i][idx] = $_tbody;
				const $box = addBox(title, $_table);
				$box
					.css('width', '250px').css('left', `${(i-1)*250}px`)
					.css('height', '180px').css('top', `${idx*180 +30}px`);
				$box.find('div.box_cotent').css('overflow-y', 'scroll');
			}
		}

		// 所持キャラを振り分け
		const CheckColumn = [ 9, 10, 11 ];
		Object.keys(chkSame1).forEach((unit_id, i) => {
			const chara_data = CD[unit_id];
			const same_data = chkSame1[unit_id];
			CheckColumn.forEach(column => {
				if (chara_data[column]) {
					LS_TOP.forEach((v,i) => {
						if (chara_data[column][1].indexOf(v) >= 0) {
							const $tr = $make_tr(chara_data, same_data).appendTo($tbody_list[chara_data[4]][i]);
							const $span = $tr.find('span.chara_name').attr('title', `[${column-7}:${chara_data[column][1]}]\n${chara_data[column][2]}`);
							$span.text(`${column-7}:${$span.text()}`);
						}
					})
				}
			});
		});
	}

	RegistSummary('回復系スキル', '回復系スキル', 回復系スキル);
	RegistSummary('バフスキル', 'バフスキル', バフスキル);
	RegistSummary('デバフスキル', 'デバフスキル', デバフスキル);
})();
