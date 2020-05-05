		const config = {
			height: "100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
			layout: "fitColumns", //fit columns to width of table (optional)
			selectable: true,
			cellContext:function(e, cell){
				//e - the click event object
				//cell - cell component
				e.preventDefault();
				if (cell._cell.column.definition.title === "ユニット名") {
					//【要修正】値の設定
					$('#menu_name').text(`ヴァル子`);
					$('#menu_level').text(`120`);
					$('#menu_limit').text(`110`);
					$('#menu_skill').text(`Lv.6`);
					$('#menu span').removeClass('ui-icon-check');
					$('#level_level span[data-type=level][data-level=120]').addClass('ui-icon-check')
					$('#limit_level span[data-type=limit][data-level=120]').addClass('ui-icon-check')
					$('#skill_level span[data-type=skill][data-level=2]').addClass('ui-icon-check')
					$('#limit_break').removeClass('ui-state-disabled');
					$('#limit_break').addClass('ui-state-disabled');

					//【要修正】画面の下の方ならクリック位置に下端を合わせる
					$cm.css('left', `${e.pageX}px`);
					$cm.css('top',  `${e.pageY}px`);
					//$cm.show();
				} else {
					$cm.hide();
				}
			},
			columns: [ //Define Table Columns
				{ title: "id", field: "id", width: 70, align: "right", visible: false, },
				{ title: "属性", field: "attr", width: 40, align: "center", },
				{ title: "ランク", field: "rankstar", width: 40, align: "center", },
				{
					title: "ユニット名", field: "name", width: 200,
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
				{ title: "リーダースキル", field: `data.${YD.LS}.${YD.LS_KOUKA}`, width: 200, align: "left", tooltip: toolTipLS.bind(null, YD.LS), formatter: skillFormatterLS.bind(null, YD.LS), },
			],
			//rowClick: function (e, row) { //trigger an alert message when the row is clicked
			//	alert("Row " + row.getData().id + " Clicked!!!!");
			//},
		};
		const ClmnIdx = { "HP": 0, "攻撃力": 0, "防御力": 0, "回復力": 0, "素早さ": 0, };
		for (let idx = 0; idx < config.columns.length; idx++) {
			if ( ClmnIdx[ config.columns[idx].title ] === 0) {
				ClmnIdx[ config.columns[idx].title ] = idx;
			}
		}

		function cellDblClick(e, cell) { // e - the click event object / cell - cell component
			const name = cell.getData().name;
			//if (confirm(`攻略Wikiで ${name} のページを開きますか？\n※ブラウザがポップアップブロックするかも`)) {
			//	window.open(`https://xn--jbkk0que.gamerch.com/${name}`, '_blank');
			//}
			const id = cell.getData().id;
			addUnit(id);
		}
		function nameFormatter(id, cell, formatterParams) {
			const data = id.getData();
			const name = data.name;
			return data.gacha >= 100
				? `<span class="nothave" title="メダル交換所">${name} (${data.gacha}枚)</span>`
				: data.gacha
					? `<span class="nothave" title="${YD.gacha_type[data.id]}">${name} (${data.gacha}%)</span>`
					: `<img class="name_icon" src="${YD.SS_URL}${data.id}${YD.SS_EXT}"> ${name}`
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
		function skillFormatterLS(id, cell, formatterParams) {
			const d = cell.getData().data[id];
			return `${chkSkillName?d[YD.NAME]:d[YD.LS_KOUKA]}`;
		}
		function toolTipLS(id, t) {
			const d = t.getData().data[id];
			return `[${d[YD.NAME]}]\n[${d[YD.LS_KOUKA]}]\n${d[YD.LS_DESC]}`;
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
		const filterFunc = { };

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

			filter['filters1'] = $('#filters1').val() || [ ];
			filter['filters2'] = $('#filters2').val() || [ ];
			filter['filters3'] = $('#filters3').val() || [ ];
			filter['filters9'] = $('#filters9').val() || [ ];
		}
		function membersUpdate() {
			filterUpdate();

			// メンバ一覧
			const chkSame1 = $('#chkSame1').prop('checked') ? {} : null;
			const growthed = $('#growthed').prop('checked') ? true : false;
			const chkGettable = $('#chkGettable').prop('checked') ? true : false;
			const gacha_unit = Object.assign({}, YD.gacha_unit);

			// 所持キャラをリストアップ
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

			// 開催中ガチャで入手可能なユニットをリストに追加
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

			// 所持キャラをフィルタ
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
					if (data[YD.LS][YD.LS_KOUKA].indexOf(filter['leader']) < 0) {
						continue;
					}
				}

				// 基本フィルタ (フィルタのいずれにもマッチしなければDROP)
				let hits = 0;
				if (filter['filters1'].length > 0) {
					for (let v of filter['filters1']) {
						const f = filterFunc[v];
						if (f) {
							if (f(data[YD.ID])) {
								hits++;
							}
						}
					}
					if (hits == 0) {
						continue;
					}
				}
				// 追加フィルタ (追加条件のいずれにもマッチしなければDROP)
				hits = 0;
				if (filter['filters2'].length > 0) {
					for (let v of filter['filters2']) {
						const f = filterFunc[v];
						if (f) {
							if (f(data[YD.ID])) {
								hits++;
							}
						}
					}
					if (hits == 0) {
						continue;
					}
				}
				// 追加フィルタ (追加条件のいずれにもマッチしなければDROP)
				hits = 0;
				if (filter['filters3'].length > 0) {
					for (let v of filter['filters3']) {
						const f = filterFunc[v];
						if (f) {
							if (f(data[YD.ID])) {
								hits++;
							}
						}
					}
					if (hits == 0) {
						continue;
					}
				}
				// 除外フィルタ (除外条件のいずれかにマッチしたらDROP)
				hits = 0;
				if (filter['filters9'].length > 0) {
					for (let v of filter['filters9']) {
						const f = filterFunc[v];
						if (f) {
							if (f(data[YD.ID])) {
								hits++;
							}
						}
					}
					if (hits > 0) {
						continue;
					}
				}

				filtered.push(members[i]);
			}

			table.setData(filtered);
			return members;
		}

		$(function(){
			const $filters1 = $("#filters1").multiselect( { zIndex: 99999, header: ['uncheckAll'], menuHeight: 600, menuWidth: 500, buttonWidth: 320, wrapText: [ ], selectedList: 1, noneSelectedText: "　フィルタを指定",             selectedText: "複数のフィルタを選択中(#)" } );
			const $filters2 = $("#filters2").multiselect( { zIndex: 99999, header: ['uncheckAll'], menuHeight: 600, menuWidth: 500, buttonWidth: 320, wrapText: [ ], selectedList: 1, noneSelectedText: "　追加の条件を指定できます",   selectedText: "複数の追加条件を選択中(#)" } );
			const $filters3 = $("#filters3").multiselect( { zIndex: 99999, header: ['uncheckAll'], menuHeight: 600, menuWidth: 500, buttonWidth: 320, wrapText: [ ], selectedList: 1, noneSelectedText: "　追加の条件を指定できます",   selectedText: "複数の追加条件を選択中(#)" } );
			const $filters9 = $("#filters9").multiselect( { zIndex: 99999, header: ['uncheckAll'], menuHeight: 600, menuWidth: 500, buttonWidth: 320, wrapText: [ ], selectedList: 1, noneSelectedText: "　除外する条件を指定できます", selectedText: "複数の除外条件を選択中(#)" } );

			// <option>リーダースキルが 攻+40%</option>
			// <option>リーダースキルが 防+40%</option>
			// <option>リーダースキルが 回+40%</option>
			// <option>リーダースキルが 早+40%</option>
			// <option>リーダースキルが HP+30%</option>
			// <option>リーダースキルが 上記５つ以外</option>
			// <option>リーダースキルが 全属性対象</option>

			filterFunc.tan3 = id => !!(CD[id][YD.SKILL3] ? CD[id][YD.SKILL3][YD.S_KOUKA]||"" : "").match(/単\d+hit x\d/);
			filterFunc.ran3 = id => !!(CD[id][YD.SKILL3] ? CD[id][YD.SKILL3][YD.S_KOUKA]||"" : "").match(/乱\d+hit x\d/);
			filterFunc.zen3 = id => !!(CD[id][YD.SKILL3] ? CD[id][YD.SKILL3][YD.S_KOUKA]||"" : "").match(/全\d+hit x\d/);
			filterFunc.tan4 = id => !!(CD[id][YD.SKILL4] ? CD[id][YD.SKILL4][YD.S_KOUKA]||"" : "").match(/単\d+hit x\d/);
			filterFunc.ran4 = id => !!(CD[id][YD.SKILL4] ? CD[id][YD.SKILL4][YD.S_KOUKA]||"" : "").match(/乱\d+hit x\d/);
			filterFunc.zen4 = id => !!(CD[id][YD.SKILL4] ? CD[id][YD.SKILL4][YD.S_KOUKA]||"" : "").match(/全\d+hit x\d/);

			filterFunc.Healer = id => {
				let hits = 0;
				[8,9,10,11].forEach(column => {
					if (CD[id][column]) {
						['単ヒール','全ヒール','リジェネ'].forEach((v,i) => {
							if ((CD[id][column][YD.NAME]||"").indexOf(v) >= 0) {
								hits++;
							}
						})
					}
				});
				return hits > 0;
			}

			function hasSkill( words ) {
				return function (id) {
					let hits = 0;
					[8,9,10,11].forEach(column => {
						if (CD[id][column]) {
							words.forEach((v,i) => {
								if ((CD[id][column][YD.NAME]||"").indexOf(v) >= 0) {
									hits++;
								}
							})
						}
					});
					return hits > 0;
				}
			}
			filterFunc.OneHeal     = hasSkill(['単ヒール']);
			filterFunc.AllHeal     = hasSkill(['全ヒール']);
			filterFunc.Rejene      = hasSkill(['リジェネ']);
			filterFunc.hasDespell  = hasSkill(['ディスペル']);
			filterFunc.hasRecovery = hasSkill(['リカバリ']);

			filterFunc.hasQuick = hasSkill(['早+']);
			filterFunc.hasShieldBoost = hasSkill(['防+']);
			filterFunc.hasWeponBoost = hasSkill(['攻+']);
			filterFunc.hasSlow = hasSkill(['早-']);
			filterFunc.hasShieldBreak = hasSkill(['防-']);
			filterFunc.hasWeponBreak = hasSkill(['攻-']);

			filterFunc.isMS = id => CD[id][YD.LS][YD.LS_TYPE] == 2;
			filterFunc.overLimit = id => CD[id][YD.HP120] > 0;
			filterFunc.arousal = id => CD[id][YD.AROUSAL] != 0;



			filterFunc.HP_worst  = id => filterStatus.call(null, "HP", YD.HP, YD.HP120, id, true);
			filterFunc.ATK_worst = id => filterStatus.call(null, "攻撃力", YD.ATK, YD.ATK120, id, true);
			filterFunc.DEF_worst = id => filterStatus.call(null, "防御力", YD.DEF, YD.DEF120, id, true);
			filterFunc.ACC_worst = id => filterStatus.call(null, "回復力", YD.ACC, YD.ACC120, id, true);
			filterFunc.SPD_worst = id => filterStatus.call(null, "素早さ", YD.SPD, YD.SPD120, id, true);
			filterFunc.HP_worse  = id => filterStatus.call(null, "HP", YD.HP, YD.HP120, id, false);
			filterFunc.ATK_worse = id => filterStatus.call(null, "攻撃力", YD.ATK, YD.ATK120, id, false);
			filterFunc.DEF_worse = id => filterStatus.call(null, "防御力", YD.DEF, YD.DEF120, id, false);
			filterFunc.ACC_worse = id => filterStatus.call(null, "回復力", YD.ACC, YD.ACC120, id, false);
			filterFunc.SPD_worse = id => filterStatus.call(null, "素早さ", YD.SPD, YD.SPD120, id, false);
			filterFunc.SPD_worse = id => filterStatus.call(null, "素早さ", YD.SPD, YD.SPD120, id, false);

			function filterStatus(st, st100, st120, id, worst) {
				const param = config.columns[ClmnIdx[st]].formatterParams;
				const tan = (param.max - param.min) / param.color.length;
				const val = Math.max(CD[id][st100], CD[id][st120]);
				let idx = Math.floor((val - param.min) / tan);
				if (idx > param.color.length) { 
					idx = param.color.length - 1;
				}
				if (val < param.min) {
					idx = 0;
				}
				return (param.color[idx] == "red" || (worst == false && param.color[idx] == "#ff6666"));
			}

			filterFunc["cat" + 0] = id => CD[id][YD.CATEGORY] == "";
			Object.keys(YD._CATEGORIES).forEach((v, i) => {
				filterFunc["cat" + v] = id => CD[id][YD.CATEGORY] == YD._CATEGORIES[v];
			});

			$filters9.multiselect('addOption', { value: 'HP_worst' }, 'HPがとても低い (赤色)');
			$filters9.multiselect('addOption', { value: 'HP_worse' }, 'HPが低い (赤色 朱色)');
			$filters9.multiselect('addOption', { value: 'ATK_worst' }, '攻撃力がとても低い (赤色)');
			$filters9.multiselect('addOption', { value: 'ATK_worse' }, '攻撃力が低い (赤色 朱色)');
			$filters9.multiselect('addOption', { value: 'DEF_worst' }, '防御力がとても低い (赤色)');
			$filters9.multiselect('addOption', { value: 'DEF_worse' }, '防御力が低い (赤色 朱色)');
			$filters9.multiselect('addOption', { value: 'SPD_worst' }, '素早さがとても低い (赤色)');
			$filters9.multiselect('addOption', { value: 'SPD_worse' }, '素早さが低い (赤色 朱色)');
			$filters9.multiselect('addOption', { value: 'ACC_worst' }, '回復力がとても低い (赤色)');
			$filters9.multiselect('addOption', { value: 'ACC_worse' }, '回復力が低い (赤色 朱色)');
			$filters9.multiselect('addOption', { value: 'zen4'      }, '4全 (第4スキルが全体攻撃)');
			$filters9.multiselect('addOption', { value: 'ran4'      }, '4乱 (第4スキルがランダム攻撃)');
			$filters9.multiselect('addOption', { value: 'cat0'      }, 'カテゴリ：汎用キャラ');
			$filters9.multiselect('addOption', { value: 'cat1'      }, 'カテゴリ：メインストーリー');
			$filters9.multiselect('addOption', { value: 'cat999'    }, 'カテゴリ：コラボ');
			$filters9.multiselect('refresh');
			$filters9.on('multiselectbeforeuncheckall', delayF.bind(null,  100));
			$filters9.on("multiselectclick",            delayF.bind(null, 1000));

			for (let $obj of [ $filters1, $filters2, $filters3, ]) {
				$obj.multiselect('addOption', { value: 'OneHeal' }, '単ヒール');
				$obj.multiselect('addOption', { value: 'AllHeal' }, 'ヒールオール');
				$obj.multiselect('addOption', { value: 'Rejene' }, 'オートヒール');
				$obj.multiselect('addOption', { value: 'hasDespell' }, 'ディスペル持ち');
				$obj.multiselect('addOption', { value: 'hasRecovery' }, 'リカバリー持ち');

				$obj.multiselect('addOption', { value: 'hasQuick' }, 'クイック持ち');
				$obj.multiselect('addOption', { value: 'hasWeponBoost' }, 'ウェポンブースト持ち');
				$obj.multiselect('addOption', { value: 'hasShieldBoost' }, 'シールドブースト持ち');

				$obj.multiselect('addOption', { value: 'hasSlow' }, 'スロウ持ち');
				$obj.multiselect('addOption', { value: 'hasWeponBreak' }, 'ウェポンブレイク持ち');
				$obj.multiselect('addOption', { value: 'hasShieldBreak' }, 'シールドブレイク持ち');


				$obj.multiselect('addOption', { value: 'tan4' }, '4単 (第4スキルが単体攻撃)');
				$obj.multiselect('addOption', { value: 'ran4' }, '4乱 (第4スキルがランダム攻撃)');
				$obj.multiselect('addOption', { value: 'zen4' }, '4全 (第4スキルが全体攻撃)');
				$obj.multiselect('addOption', { value: 'tan3' }, '3単 (第3スキルが単体攻撃)');
				$obj.multiselect('addOption', { value: 'ran3' }, '3乱 (第3スキルがランダム攻撃)');
				$obj.multiselect('addOption', { value: 'zen3' }, '3全 (第3スキルが全体攻撃)');

				$obj.multiselect('addOption', { value: 'isMS' }, 'メンバースキル');
				$obj.multiselect('addOption', { value: 'overLimit' }, '限界突破キャラ');
				$obj.multiselect('addOption', { value: 'arousal' }, '究極覚醒キャラ');

				$obj.multiselect('addOption', { value: 'cat0' }, 'カテゴリ：汎用キャラ');
				Object.keys(YD._CATEGORIES).forEach((v, i) => {
					$obj.multiselect('addOption', { value: `cat${v}` }, `カテゴリ：${YD._CATEGORIES[v]}`);
				});
				$obj.multiselect('refresh');

				$obj.on('multiselectbeforeuncheckall', delayF.bind(null,  100));
				$obj.on("multiselectclick",            delayF.bind(null, 1000));
			}

			let filterDelay;
			const f = function(event, ui) {
				filterDelay = undefined;
				membersUpdate();
			};
			function delayF(delay, event, ui){
				// event The original event object, most likely click.
				// ui.value The value of the checkbox.
				// ui.text The text of the checkbox.
				// ui.checked Whether or not the input was checked or unchecked.
				if (filterDelay) {
					clearTimeout(filterDelay);
				}
				filterDelay = setTimeout(f.bind(this, event, ui), delay);
			};
		});

		// 雛形
		const $tmpl = $('table#tmpl').removeAttr('id');
		let tmpl_height = 0;

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
			$box.find('input[type=checkbox]').prop('checked', true).on('change', function(){ $box.remove(); /* listAutoSave(); */ })
			/* $box.on('drag', listAutoSave); */

			return $box;
		}

		function openWikiPage(name) {
			if (confirm(`攻略Wikiで ${name} のページを開きますか？\n※ブラウザがポップアップブロックするかも`)) {
				window.open(`https://xn--jbkk0que.gamerch.com/${name}`, '_blank');
			}
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

		const $cm = $("#contextmenu");
		const $menu = $("#menu").menu({
			select: function(event, ui) {
				$cm.hide();
			},
		});

		function page_start(){
			loadData();

			tmpl_height = $tmpl.height();
			$tmpl.remove().show();

			fetch(YURUDATA._url.replace(/[^\/]+$/, YURUDATA.gacha_date)).then((res) => res.json()).then((json) => {
				YURUDATA.gacha = json;
				const gacha_unit = YURUDATA.gacha_unit;
				const gacha_type = YURUDATA.gacha_type;
				Object.keys(json).forEach(v => Object.keys(json[v]).forEach(v2 => { gacha_unit[v2] = json[v][v2]; gacha_type[v2] = v; }));
				membersUpdate();
			});

			setTimeout(() => {
				$cm.css({
					'visibility': '',
					'position': 'absolute',
					'width': `${$menu.width()}px`,
					'heigth': `${$menu.height()}px`,
				}).hide();
			}, 1000);
		}

