(() => {
	function 属性別ユニット一覧() {
		// 表を作る (縦:リーダースキル / 横:属性) の中に (ユニット名,★3,★4,★5 のリスト表)
		const $tbody_list = [];
		for (let i = 1; i < YD.ATTR_J.length; i++) {
			const title = `${YD.ATTR_J[i]}`;
			const $_table = $('<table>').attr('border', '1').attr('cellspacing', "0").attr('width', '100%').css('border-color', '#eee').attr('cellpadding', "0").css("font-size", "small");
			const $_tbody = $('<tbody>').appendTo($_table);
			$tbody_list[i] = $_tbody;
			const $box = addBox(title, $_table);
			$box
				.css('width', '250px').css('left', `${(i-1)*250}px`)
				.css('height', '800px').css('top', `30px`);
			$box.find('div.box_cotent').css('overflow-y', 'scroll');
		}

		// 所持キャラを振り分け
		const attr_total = [ [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0] ];
		Object.keys(chkSame1).forEach((unit_id, i) => {
			const chara_data = CD[unit_id];
			const same_data = chkSame1[unit_id];
			// 名前枠を 限凸 状態や 最大Lv や リーダースキル や 装備枠解放 の状態で変化
			const $td_name = $('<td>').text(chara_data[YD.NAME])
				.css('background-color', same_data[0] >= 100 ? '#ccccff' : '')
				.css('color', same_data[1] > 1 ? '#f00' : '')
				.css('text-overflow', 'ellipsis')
				.css('white-space', 'nowrap')
				.css('overflow', 'hidden')
				//.css('max-width', '0');
				.data('id', chara_data[YD.ID])
				.on('dblclick', addUnit.bind(null, chara_data[YD.ID]))
				.on('mouseover', mouseOver)
				.on('mouseout', mouseOut);
			$('<tr>')
				.append($td_name)
				.append($('<td>').text(same_data[3] || '').css('text-align', 'right'))
				.append($('<td>').text(same_data[4] || '').css('text-align', 'right'))
				.append($('<td>').text(same_data[5] || '').css('text-align', 'right'))
				.appendTo($tbody_list[chara_data[4]]);

			attr_total[ chara_data[4] ][ 3 ] += same_data[3];
			attr_total[ chara_data[4] ][ 4 ] += same_data[4];
			attr_total[ chara_data[4] ][ 5 ] += same_data[5];
		});
		for (let i = 1; i < YD.ATTR_J.length; i++) {
			$('<tr>')
				.append( $('<td>').text('合計') )
				.append($('<td>').text(attr_total[i][3]).css('text-align', 'right'))
				.append($('<td>').text(attr_total[i][4]).css('text-align', 'right'))
				.append($('<td>').text(attr_total[i][5]).css('text-align', 'right'))
				.prependTo($tbody_list[i]);
		}
	}
	RegistSummary('属性別ユニット一覧', '属性別ユニット一覧', 属性別ユニット一覧);
})();

