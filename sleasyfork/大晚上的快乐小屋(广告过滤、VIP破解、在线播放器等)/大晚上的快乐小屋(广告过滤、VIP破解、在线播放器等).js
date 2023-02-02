// ==UserScript==
// @name         大晚上的快乐小屋(广告过滤、VIP破解、在线播放器等)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       gem_xl
// @include      *://www.*.com/enter*
// @include      *://www.*.com/index/*
// @include      *://www.*.com/vip/*
// @include      *://www.*.com/shipin*
// @include      *://www.*.com/xiazai*
// @include      *://www.*.com/tupian*
// @include      *://www.*.com/meinv*
// @include      *://www.*.com/xiaoshuo*
// @include      *://www.*.com/yousheng*
// @include      *://www.jingwuhotel.com/xiaoshuo/*/*.html
// @require      https://cdn.bootcdn.net/ajax/libs/hls.js/1.0.8-0.canary.7807/hls.js
// ==/UserScript==

(function() {

	function insertAfter(a, b) {
		var p = a.parentNode;
		if (p.lastChild == a) {
			p.appendChild(b);
		} else {
			p.insertBefore(b, a.nextSibling);
		}
	}

	function addOnLoadEvent(newOnload) {
		var oldOnload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = newOnload;
		} else {
			window.onload = function() {
				oldOnload();
				newOnload();
			}
		}
	}
	var main = {
		checkURL: function() {
			var host = location.hostname;
			var res = "others";
			if (host === "www.jingwuhotel.com") {
				res = "jingwuhotel";
			} else {
				var head_keywords = ["成人", "A片", "草榴", "猫咪"];
				for (let i in head_keywords) {
					if (document.querySelector("head").innerHTML.search(i) !== -1) {
						res = "maomi";
					}
				}
			}
			return res;
		},
		on: function() {
			var url = this.checkURL();
			var msg;
			switch (url) {
				case "jingwuhotel":
					console.log("URL匹配成功:jingwuhotel");
					jingwuhotel.on();
					break;
				case "maomi":
					console.log("URL匹配成功:maomiav");
					maomiav.on();
					break;
				default:
					console.log("URL匹配失败");
			}
		}
	};
	var maomiav = {
		classBox: ["section section-banner ad-container", "container header-container border_bootom",
			"container footer-container"
		],
		adSelector: ["header.header-container", ".body-fix.app-down-fix"],
		hide: function(obj) {
			if (obj && obj.style.display !== "none") {
				obj.style.display = "none";
			}
		},
		searchAD: function() {
			var obj;
			var classBox = this.classBox;
			for (let i in classBox) {
				obj = document.getElementsByClassName(classBox[i])[0];
				if (obj && obj.className === "container header-container border_bootom") {
					this.hide(obj.children[1]);
				} else {
					this.hide(obj);
				}
			}
			var adSelector = this.adSelector;
			for (let i in adSelector) {
				obj = document.querySelectorAll(adSelector[i]);
				if (obj[0]) {
					obj.forEach((e) => {
						this.hide(e)
					})
				}
			}
		},
		clearAD: function() {
			var count = 0;
			setInterval(function() {
				if (count < 3) {
					var favCanvas = document.getElementById("favCanvas");
					if (favCanvas && favCanvas.style.display === "none") {
						count += 1;
						var closeTips = document.getElementsByClassName("bg_red close_dialog")[0];
						if (closeTips) {
							closeTips.click();
						}
					} else if (favCanvas && favCanvas.style.display !== "none") {
						favCanvas.children[0].click();
					} else if (!favCanvas) {
						count += 1;
					}
				} else {
					maomiav.searchAD();
				}
			}, 200);
		},
		playM3u8: function(obj, url) {
			if (Hls.isSupported()) {
				var video = obj;
				var hls = new Hls();
				var m3u8Url = decodeURIComponent(url)
				hls.loadSource(m3u8Url);
				hls.attachMedia(video);
				hls.on(Hls.Events.MANIFEST_PARSED, function() {
					video.play();
				});
			}
		},
		createBtn: function() {
			var a = document.getElementsByClassName("nav nav-tabs")[0].children[0];
			var b = document.createElement("li");
			var c = document.createElement("a");
			var d = document.createElement("i");
			var e = document.createElement("span");
			var url = document.getElementsByClassName("app_hide")[0].children[0].children[0]
				.getAttribute(
					"data-clipboard-text");
			url = url.replace("www.mmxzxl1", "s2s.baimi0517");
			url = url.slice(0, url.lastIndexOf("/")) + "/hls/1/index.m3u8";
			c.href = url;
			c.id = "newurl"
			c.setAttribute("title", "视频链接");
			d.setAttribute("class", "icon iconfont icon-download");
			e.innerText = "视频链接";
			b.appendChild(c);
			c.appendChild(d);
			c.appendChild(e);
			insertAfter(a, b);
		},
		createPlayer: function() {
			var a = document.createElement("div");
			var b = document.createElement("video");
			var c = document.getElementsByClassName("foot-collect")[0];
			var d = document.getElementById("newurl").href;
			a.style.padding = "20px 0";
			a.style.borderTop = "2px solid #ccc";
			a.style.borderBottom = "2px solid #ccc";
			a.style.marginTop = "20px";
			a.style.marginBottom = "20px";
			a.appendChild(b);
			b.id = "onlineVideo";
			b.style = "width:980px;height:calc(60vm);max-width:100% ;max-height: 100%;margin: auto;";
			b.setAttribute("controls", "");
			c.parentNode.insertBefore(a, c);
			this.playM3u8(b, d);
			console.log("player-src:" + d);
		},
		replaceVip: function() {
			var a = document.getElementsByTagName("a");
			var b = a.length;
			var c = "/vip/play-";
			var d = "/shipin/play-"
			for (let i = 0; i < b; i++) {
				var e = a[i].href;
				if (typeof e === "string") {
					if (e.search(c) !== -1) {
						a[i].href = e.replace(c, d);
					}
				}
			}
		},
		createJumpLink: function() {
			var abox = document.getElementsByClassName("ft")[0];
			if (abox) {
				var newbox = document.createElement("div");
				newbox.setAttribute("class", "ft");
				var a = document.createElement("a");
				a.href = "https://" + location.hostname + "/index/home.html";
				a.innerText = "点击前往";
				a.id = "newjumplink";
				newbox.appendChild(a);
				abox.parentElement.insertBefore(newbox, abox);
				abox.style.display = "none";
				a.click();
			}
		},
		on: function() {
			var path = location.pathname;
			if (document.getElementsByClassName("maomi-content").length !== 0 || document.querySelector(
					"link[href*=mmjs]")) {
				try {
					if (path.search("xiazai/") !== -1 && path.search("list-") === -1) {
						console.log("下载页");
						this.createBtn();
						this.createPlayer();
					} else if (path.search("shipin/play-") !== -1) {
						console.log("视频页");
						this.createBtn();
					} else if (path.search("vip/index.html") !== -1) {
						console.log("vip首页");
						this.replaceVip();
					} else if (path.search("vip/list-") !== -1) {
						console.log("vip列表页");
						this.replaceVip();
					} else if (path.search("index/home.html") !== -1) {
						console.log("首页");
						this.replaceVip();
					} else {
						console.log("非指定页!");
					}
				} catch (e) {
					console.log("未知错误!");
				}
				this.clearAD();
			}
			if (path.search("enter") !== -1) {
				console.log("进入页");
				this.createJumpLink();
			}
		}
	};
	var jingwuhotel = {
		classBox: ["hf-wp", "nofollow", "beruxDGT", "cmoqstKU", "readtj"],
		search: function() {
			var classBox = this.classBox;
			if (classBox.length > 0) {
				for (let i = 0; i < classBox.length; i++) {
					this.hide1(classBox[i]);
				}
			}
			this.hide2();
			this.hide3();
		},
		hide1: function(classStr) {
			var obj = document.getElementsByClassName(classStr);
			for (let i = 0; i < obj.length; i++) {
				if (obj[i].style.display !== "none") {
					obj[i].style.display = "none";
				}
			}
		},
		hide2: function() {
			var a = document.getElementsByTagName("a");
			for (let i = 0; i < a.length; i++) {
				if (a[i].rel === "nofollow" && a[i].style.display !== "none") {
					a[i].style.display = "none";
				}
			}
		},
		hide3: function() {
			var obj = document.body.children;
			if (obj.length > 0) {
				for (let i = 0; i < obj.length; i++) {
					if (obj[i].style.zIndex === "2147483646" && obj[i].style.display !== "none") {
						obj[i].style.display = "none";
					}
					if (obj[i].className === "bottem2") {
						if (i > 1 && obj[i - 1].style.display !== "none") {
							obj[i - 1].style.display = "none";
						}
					}
					if (obj[i].className === "content_3") {
						if (i > 1 && obj[i - 1].style.display !== "none") {
							obj[i - 1].style.display = "none";
						}
					}
				}
			}
			obj = document.getElementsByTagName("article")[0];
			if (obj && obj.childElementCount > 0) {
				obj = obj.children;
				for (let i = 0; i < obj.length; i++) {
					if (obj[i].className === "bottem2") {
						if (i > 1 && obj[i - 1].style.display !== "none") {
							obj[i - 1].style.display = "none";
						}
					}
					if (obj[i].id === "content_3") {
						if (i > 1 && obj[i - 1].style.display !== "none") {
							obj[i - 1].style.display = "none";
						}
					}
				}
			}
		},
		on: function() {
			setInterval(function() {
				jingwuhotel.search();
			}, 200);
		}
	};
	main.on();
})();
