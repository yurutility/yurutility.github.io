(() => {
	function ユニット簡易カウンタ() {
		const $_table = $('<table>').attr('border', '1').attr('cellspacing', "0").attr('width', '100%').css('border-color', '#eee').attr('cellpadding', "0").css("font-size", "small");
		const $box = addBox(`所持ユニット`, $_table)
			.css('width', '250px').css('left', `8px`)
			.css('height', '220px').css('top', `32px`);

		const $_thead = $('<thead>').appendTo($_table);
		const $_tbody = $('<tbody>').appendTo($_table);


		// 所持キャラを振り分け
		const attr_total = [ [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0] ];
		Object.keys(chkSame1).forEach((unit_id, i) => {
			const chara_data = CD[unit_id];
			const same_data = chkSame1[unit_id];
			attr_total[ chara_data[YD.ATTR] ][ 3 ] += same_data[3];
			attr_total[ chara_data[YD.ATTR] ][ 4 ] += same_data[4];
			attr_total[ chara_data[YD.ATTR] ][ 5 ] += same_data[5];
		});
		let attr_total_all = [ 0, 0, 0, 0, 0, 0 ];
		for (let i = 1; i < YD.ATTR_J.length; i++) {
			attr_total_all[3] += attr_total[i][3];
			attr_total_all[4] += attr_total[i][4];
			attr_total_all[5] += attr_total[i][5];
			$('<tr>')
				.append( $('<th>').text(YD.ATTR_J[i]) )
				.append($('<td>').text(attr_total[i][3]).css('text-align', 'right'))
				.append($('<td>').text(attr_total[i][4]).css('text-align', 'right'))
				.append($('<td>').text(attr_total[i][5]).css('text-align', 'right'))
				.append($('<td>').text( attr_total[i][3] + attr_total[i][4] + attr_total[i][5] ).css('text-align', 'right'))
				.appendTo($_tbody);
		}
		$('<tr>')
			.append( $('<th>').text(`計`) )
			.append($('<td>').text(attr_total_all[3]).css('text-align', 'right'))
			.append($('<td>').text(attr_total_all[4]).css('text-align', 'right'))
			.append($('<td>').text(attr_total_all[5]).css('text-align', 'right'))
			.append($('<td>').text(attr_total_all[3] + attr_total_all[4] + attr_total_all[5]).css('text-align', 'right'))
			.appendTo($_tbody);
		$('<tr>')
			.append( $('<th>').text(`合計`).attr('width','20%') )
			.append($('<th>').text(`★3`).css('text-align', 'right').attr('width','20%'))
			.append($('<th>').text(`★4`).css('text-align', 'right').attr('width','20%'))
			.append($('<th>').text(`★5`).css('text-align', 'right').attr('width','20%'))
			.append($('<th>').text(`計`).css('text-align', 'right').attr('width','20%'))
			.prependTo($_thead);
	}
	RegistSummary('ユニット簡易カウンタ', 'ユニット簡易カウンタ', ユニット簡易カウンタ);
})();

