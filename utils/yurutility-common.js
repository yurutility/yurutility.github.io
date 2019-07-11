// 所持キャラデータ (JSON化して localStorage['data'] に保存)
// テストで data_packed と data_compressed にも入れてる
const YD = YURUDATA;
const CD = YURUDATA.data;

let savedata;
function loadData() {
	let jsoned = localStorage.getItem('data_packed') || "{}";
	if (jsoned == "[]") {
		// データ空っぽ
		savedata = {"10023":[[]],"10024":[[]],"10025":[[]],"10054":[[]],"10073":[[]],"20045":[[]],"20063":[[]],"20073":[[]],"30024":[[]],"30053":[[]],"30225":[[]],"40033":[[]],"40043":[[]],"40073":[[]],"50033":[[]],"50165":[[]]};
		setTimeout(alert.bind(null, "所有ユニットが未登録なので仮データとして登録しました"), 2000);
	} else {
		savedata = JSON.parse(jsoned);
	}

	Object.keys(savedata).forEach((v, i) => {
		savedata[v].forEach((v) => {
			v[0] = v[0] || 1;
			v[1] = v[1] || 1;
			v[2] = v[2] || 1;
			v[3] = v[3] || 0;
		})
	});
}

function saveData() {
	//localStorage.setItem('data', JSON.stringify( savedata ));

	const packed = {};
	Object.keys(savedata).forEach((v, i) => { // v = unit_id
		packed[v] = savedata[v].map((v) => { // v = [ level, ls_level, ?, ? ]
			const ret = [parseInt(v[0]) || 1, parseInt(v[1]) || 1, parseInt(v[2]) || 1, parseInt(v[3]) || 0];
			let idx = 4;
			if (ret[3] <= 0) { // 予備 [0..]
				idx--;
				if (ret[2] <= 1) { // 装備欄解放済み
					idx--;
					if (ret[1] <= 1) { // リーダースキル[1..6]
						idx--;
						if (ret[0] <= 1) { // レベル [1..120]
							idx--;
						}
					}
				}
			}
			return ret.slice(0, idx);
		});
	});
	$('#txtData').val(JSON.stringify(packed));
	localStorage.setItem('data_packed', JSON.stringify(packed));
	//localStorage.setItem('data_compressed', LZString.compressToBase64(JSON.stringify(packed)));
}

const [addBox, removeBox] = (() => {
	let zIndex = 10000;
	function removeBox() {
		$('#basePanel').find('div.ui-widget-content:has(input[type=checkbox]:not(:checked))').remove();
	}
	function addBox(title, $content) {
		++zIndex;
		const $div = $('<div>').addClass('box_cotent')
			.css('width', '100%').css('height', 'calc(100% - 24px - 2px)').css('overflow-y', 'auto').css('overflow-x', 'hidden')
			//.css('background-color', '#ffc')
			.append($content);
		const $box = $('<div>')
			.css('position', 'absolute')
			.css('z-index', zIndex)
			.attr('id', `box${zIndex}`)
			.css('width', '200px').css('height', '200px')
			.addClass('ui-widget-content')
			.append(
				$('<p>')
					.addClass('ui-widget-header').css('margin-block-start', '0').css('margin-block-end', '0')
					.css('text-align', 'center').css('maring', '0')
					.css('height', '24px')
					.append(
						$('<input type="checkbox">').prop('checked', false)
					).append(
						$('<span>').text(title)
					)
			).append($div)
			.appendTo('#basePanel')
			.resizable({
				grid: 10,
				//maxHeight: 250,
				//maxWidth: 350,
				minHeight: 100,
				minWidth: 150,
			}).draggable({
				handle: "p",
				grid: [10, 10],
				containment: "#basePanel",
			}).disableSelection()
			.on('mousedown', function () {
				$(this).css('z-index', ++zIndex);
			})
			.on('dblclick', function () {
				$(this).css('z-index', 20000 - zIndex);
			});
		return $box;
	}
	return [addBox, removeBox];
})();

// https://github.com/pieroxy/lz-string/tree/1.4.4
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
// For more information, the home page: http://pieroxy.net/blog/pages/lz-string/testing.html
const LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);
