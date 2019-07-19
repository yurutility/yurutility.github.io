		const config = {
			height: "100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
			layout: "fitColumns", //fit columns to width of table (optional)
			columns: [ //Define Table Columns
				{ title: "id", field: "id", width: 70, align: "right", visible: false, },
				{ title: "属性", field: "attr", width: 40, align: "center", },
				{ title: "ランク", field: "rankstar", width: 40, align: "center", },
				{
					title: "ユニット名", field: "name", width: 180,
					formatter: nameFormatter,
					cellDblClick: cellDblClick,
					cellMouseOver: function (e, cell) { // e - the event object / cell - cell component
						const id = cell.getData().id;
						const name = CD[id][YD.NAME];

						//console.log(`mouse:${e.pageX}x${e.pageY} window:${$(window).height()}`);
						const window_height = $(window).height();
						const mouseY = e.pageY;

						const boxPosY = (mouseY > window_height - 240) ? mouseY - 40 - 150 : mouseY + 40 ;
						let boxPosX = -10;
						for (let idx = 1; idx <= 2; idx++) {
							boxPosX += config.columns[idx].width;
						}

						$('#chara_name').text(name);
						$('#chara_icon').attr('src', `${YD.SS_URL}${id}${YD.SS_EXT}`);
						$('#chara_info').show().css({ top: boxPosY, left: boxPosX });

					},
					cellMouseOut: function (e, cell) { // e - the event object / cell - cell component
						$('#chara_info').hide();
					},
				},
				//{ title: "コスト", field: "data.5", width: 40, align: "right", },
				//{ title: "MAX", field: "data.6" },
				//{ title: "限凸", field: "data.7" },
				//{ title: "HP", field: "data.13", width: 60, align: "right", },
				{
					title: "HP", field: `status.HP`, formatter: "progress",
					formatterParams: {
						max: 3500,
						min: 1000,
						legend: true,
						legendAlign: 'right',
						color: ["red", "red", "#ff6666", "orange", "#66ff66"],
					},
					sorter: "number", width: 100,
				},
				//{ title: "攻", field: "data.14", width: 60, align: "right", },
				{
					title: "攻撃力", field: `status.ATK`, formatter: "progress",
					formatterParams: {
						max: 2500,
						min: 1000,
						legend: true,
						legendAlign: 'right',
						color: ["red", "red", "red", "#ff6666", "orange", "#66ff66", "#66ff66", "#66ff66"],
					},
					sorter: "number", width: 100,
				},
				//{ title: "防", field: "data.15", width: 60, align: "right", },
				{
					title: "防御力", field: `status.DEF`, formatter: "progress",
					formatterParams: {
						max: 2000,
						min: 500,
						legend: true,
						legendAlign: 'right',
						color: ["red", "red", "red", "#ff6666", "orange", "#66ff66", "#66ff66", "#66ff66"],
					},
					sorter: "number", width: 100,
				},


				//{ title: "回", field: "data.16", width: 50, align: "right", },
				{
					title: "回復力", field: `status.ACC`, formatter: "progress",
					formatterParams: {
						max: 75,
						min: 25,
						legend: true,
						legendAlign: 'right',
						color: ["red", "red", "#ff6666", "orange", "#66ff66", "#66ff66", "#66ff66"],
					},
					//headerFilter: minMaxFilterEditor,
					//headerFilterFunc: minMaxFilterFunction,
					sorter: "number", width: 100,
				},
				//{ title: "早", field: "data.17", width: 50, align: "right", },
				{
					title: "素早さ", field: `status.SPD`, formatter: "progress",
					formatterParams: {
						max: 65,
						min: 25,
						legend: true,
						legendAlign: 'right',
						//color: ["#00dd00", "orange", "rgb(255,0,0)"],
						color: ["red", "red", "red", "#ff6666", "#ff6666", "orange", "#66ff66", "#66ff66"],
					}, sorter: "number", width: 100
				},
				//{ title: "HP120", field: "data.18" },
				//{ title: "攻120", field: "data.19" },
				//{ title: "防120", field: "data.20" },
				//{ title: "回120", field: "data.21" },
				//{ title: "早120", field: "data.22" },
				//{ title: "進化", field: "data.23.1", width: 180, },
				//{ title: "最終", field: "data.24.1", width: 180, },
				//{ title: "1技", field: "data.8.0", width: 100, align: "left", },
				{ title: "2技", field: `data.${YD.SKILL2}.${YD.NAME}`, width: 100, align: "left", tooltip: toolTip.bind(null, YD.SKILL2), formatter: skillFormatter.bind(null, YD.SKILL2), },
				{ title: "3技", field: `data.${YD.SKILL3}.${YD.NAME}`, width: 100, align: "left", tooltip: toolTip.bind(null, YD.SKILL3), formatter: skillFormatter.bind(null, YD.SKILL3), },
				{ title: "4技", field: `data.${YD.SKILL4}.${YD.NAME}`, width: 100, align: "left", tooltip: toolTip.bind(null, YD.SKILL4), formatter: skillFormatter.bind(null, YD.SKILL4), },
				{ title: "リーダースキル", field: `data.${YD.LS}`, width: 200, align: "left", },
			],
			//rowClick: function (e, row) { //trigger an alert message when the row is clicked
			//	alert("Row " + row.getData().id + " Clicked!!!!");
			//},
		};

		function cellDblClick(e, cell) { // e - the click event object / cell - cell component
			const name = cell.getData().name;
			if (confirm(`攻略Wikiで ${name} のページを開きますか？`)) {
				window.open(`https://xn--jbkk0que.gamerch.com/${name}`, '_blank');
			}
		}
		function nameFormatter(id, cell, formatterParams) {
			const data = id.getData();
			const name = data.name;
			return data.gacha >= 100
				? `<span class="nothave" title="メダル交換所">${name} (${data.gacha}枚)</span>`
				: data.gacha
					? `<span class="nothave" title="${YD.gacha_type[data.id]}">${name} (${data.gacha}%)</span>`
					: name
					;
		}
		let chkSkillName = false;
		function skillFormatter(id, cell, formatterParams) {
			const d = cell.getData().data[id];
			const t = (d[0] == 3 && d[1].indexOf('-') >= 0) ? 13 : d[0];
			return `<div class="skilltype skilltype${chkSkillName?'A':'B'} skilltype${t}">${chkSkillName?d[2]:d[1]}</div>`;
		}
		function toolTip(id, t) {
			const d = t.getData().data[id];
			return `[${d[2]}]\n[${d[1]}]\n${d[3]}`;
		}

		{
			// ここを非同期にしたい
			for (let unit_id in CD) {

				const data = CD[unit_id].split(",");
				const name = data[YD.NAME];
				for (let i = 0; i < data.length; i++) {
					data[i] = parseInt(data[i]);
				}
				data[YD.NAME] = name;

				CD[unit_id] = data;
			}
			for (let unit_id in CD) {
				CD[unit_id][YD.LS] = ls[CD[unit_id][YD.LS]];
				CD[unit_id][YD.SKILL1] = actions[CD[unit_id][YD.SKILL1]];
				CD[unit_id][YD.SKILL2] = actions[CD[unit_id][YD.SKILL2]];
				CD[unit_id][YD.SKILL3] = actions[CD[unit_id][YD.SKILL3]];
				CD[unit_id][YD.SKILL4] = actions[CD[unit_id][YD.SKILL4]];
				CD[unit_id][YD.NEXT_ID] = CD[CD[unit_id][YD.NEXT_ID]];
				CD[unit_id][YD.LAST_ID] = CD[CD[unit_id][YD.LAST_ID]];
			}
		}

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
		function membersUpdate() {
			filterUpdate();

			// メンバ一覧
			const chkSame1 = $('#chkSame1').prop('checked') ? {} : null;
			const growthed = $('#growthed').prop('checked') ? true : false;
			const chkGettable = $('#chkGettable').prop('checked') ? true : false;
			const gacha_unit = Object.assign({}, YD.gacha_unit);

			const members = [];
			for (let unit_id in savedata) {
				let data = CD[unit_id];

				for (let member in savedata[unit_id]) {

					if (growthed) {
						if (savedata[unit_id][member][0] < 80) {
							continue;
						}
					}

					if (chkSame1) {
						const last_unit_id = data[YD.LAST_ID][YD.ID];
						if (chkSame1[last_unit_id])
							break;
						chkSame1[last_unit_id] = true;
						data = CD[last_unit_id];
						gacha_unit[ last_unit_id ] = 0;
					}
					gacha_unit[ unit_id ] = 0;

					if (filter['level'] == 100) {
						const status = { HP: data[YD.HP], ATK: data[YD.ATK], DEF: data[YD.DEF], SPD: data[YD.SPD], ACC: data[YD.ACC] }
						members.push({ id: data[YD.ID], name: data[YD.NAME], rare: data[YD.RARE], rankstar: "★" + data[YD.RARE], attr: YD.ATTR_J[data[YD.ATTR]], member: savedata[unit_id][member], data: data[YD.LAST_ID], status: status, });
					} else if (filter['level'] == 120) {
						const status = (data[YD.HP120] > 0)
							? { HP: data[YD.HP120], ATK: data[YD.ATK120], DEF: data[YD.DEF120], SPD: data[YD.SPD120], ACC: data[YD.ACC120] }
							: { HP: data[YD.HP], ATK: data[YD.ATK], DEF: data[YD.DEF], SPD: data[YD.SPD], ACC: data[YD.ACC] }
							;
						members.push({ id: data[YD.ID], name: data[YD.NAME], rare: data[YD.RARE], rankstar: "★" + data[YD.RARE], attr: YD.ATTR_J[data[YD.ATTR]], member: savedata[unit_id][member], data: data[YD.LAST_ID], status: status, });
					} else {
						// 現時点でここを通らない
						members.push({ id: data[YD.ID], name: data[YD.NAME], rare: data[YD.RARE], rankstar: "★" + data[YD.RARE], attr: YD.ATTR_J[data[YD.ATTR]], member: savedata[unit_id][member], data: data, });
					}

				}
			}

			if (chkGettable) {
				for (let unit_id in gacha_unit)
				{
					if (gacha_unit[ unit_id ] > 0)
					{
						const data = CD[unit_id];
						if (filter['level'] == 100) {
							const status = { HP: data[YD.HP], ATK: data[YD.ATK], DEF: data[YD.DEF], SPD: data[YD.SPD], ACC: data[YD.ACC] }
							members.push({ gacha: gacha_unit[unit_id], id: data[YD.ID], name: data[YD.NAME], rare: data[YD.RARE], rankstar: "★" + data[YD.RARE], attr: YD.ATTR_J[data[YD.ATTR]], member: [100,1,1,0], data: data[YD.LAST_ID], status: status, });
						} else if (filter['level'] == 120) {
							const status = (data[YD.HP120] > 0)
								? { HP: data[YD.HP120], ATK: data[YD.ATK120], DEF: data[YD.DEF120], SPD: data[YD.SPD120], ACC: data[YD.ACC120] }
								: { HP: data[YD.HP], ATK: data[YD.ATK], DEF: data[YD.DEF], SPD: data[YD.SPD], ACC: data[YD.ACC] }
								;
							members.push({ gacha: gacha_unit[unit_id], id: data[YD.ID], name: data[YD.NAME], rare: data[YD.RARE], rankstar: "★" + data[YD.RARE], attr: YD.ATTR_J[data[YD.ATTR]], member: [100,1,1,0], data: data[YD.LAST_ID], status: status, });
						} else {
							// 現時点でここを通らない
							members.push({ gacha: gacha_unit[unit_id], id: data[YD.ID], name: data[YD.NAME], rare: data[YD.RARE], rankstar: "★" + data[YD.RARE], attr: YD.ATTR_J[data[YD.ATTR]], member: [100,1,1,0], data: data, });
						}
						
					}
				}
			}

			// フィルタ
			const filtered = [];
			for (let i = 0; i < members.length; i++) {
				const data = members[i].data;

				// 知識の精霊はスキップ
				if (data[YD.ID] >= 100000) {
					continue;
				}
				// 2:ランク
				if (!filter[`rare${members[i].rare}`]) {
					continue;
				}
				// 4:属性
				if (!filter[`attr${data[YD.ATTR]}`]) {
					continue;
				}
				// リーダースキル
				if (filter['leader']) {
					if (filter['leader'] != data[YD.LS]) {
						continue;
					}
				}
				filtered.push(members[i]);
			}

			table.setData(filtered);
			return members;
		}

		let table;
		//$(() =>
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

			$('input.filter_r, input.filter_t, input.filter_c, #filter_ls, #chkSame1, #chkGettable, #growthed').on('change', membersUpdate);

			$('#chkSkillName').on('change', function () {
				chkSkillName = $('#chkSkillName').prop('checked');
				membersUpdate();
			});
			table = new Tabulator("#example-table", config);
		}
		//);

		YURUDATA.gacha_unit = { };
		YURUDATA.gacha_type = { };

		function page_start(){
			loadData();

			fetch(YURUDATA._url.replace(/[^\/]+$/, YURUDATA.gacha_date)).then((res) => res.json()).then((json) => {
				YURUDATA.gacha = json;
				const gacha_unit = YURUDATA.gacha_unit;
				const gacha_type = YURUDATA.gacha_type;
				Object.keys(json).forEach(v => Object.keys(json[v]).forEach(v2 => { gacha_unit[v2] = json[v][v2]; gacha_type[v2] = v; }));
				membersUpdate();
			});
		}


