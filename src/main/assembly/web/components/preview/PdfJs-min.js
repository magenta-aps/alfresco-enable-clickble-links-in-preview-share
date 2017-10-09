(function() {
    var e = 0,
        t = .25,
        i = 4,
        s = YAHOO.util.Dom,
        n = YAHOO.util.Event,
        a = YAHOO.util.Element,
        o = Alfresco.util.encodeHTML;
    Alfresco.WebPreview.prototype.Plugins.PdfJs = function(e, t) { return this.pages = [], this.pageText = [], this.widgets = {}, this.documentConfig = {}, this.wp = e, this.wp.id = e.id, this.attributes = YAHOO.lang.merge(Alfresco.util.deepCopy(this.attributes), t), this.onPdfLoaded = new YAHOO.util.CustomEvent("pdfLoaded", this), this.onResize = new YAHOO.util.CustomEvent("resize", this), this }, Alfresco.WebPreview.prototype.Plugins.PdfJs.prototype = { attributes: { src: null, srcMaxSize: "", skipbrowsertest: "false", defaultScale: "auto", scaleDelta: "1.1", autoMinScale: "0.65", autoMinScaleMobile: "0.525", autoMaxScale: "1.25", pageLayout: "multi", disableTextLayer: "false", disableAnnotationLayer: "false", useLocalStorage: "true", autoSearch: "false", progressiveLoading: "false", disabledPageLinking: !0 }, pdfDocument: null, pageNum: 1, pages: [], pageText: [], numPages: 0, widgets: {}, maximized: !1, documentConfig: {}, inDashlet: !1, workerSrc: "", currentScaleSelection: null, report: function() { var e = !0,
                t = "true" === this.attributes.skipbrowsertest,
                i = this.attributes.srcMaxSize; return i.match(/^\d+$/) && this.wp.options.size > parseInt(i) ? this.wp.msg("PdfJs.tooLargeFile", Alfresco.util.formatFileSize(this.wp.options.size), parseInt(i)) : (t || (this._isCanvasSupported() ? (YAHOO.env.ua.webkit > 0 && YAHOO.env.ua.webkit < 534 && (e = !1), YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie < 10 && (e = !1), YAHOO.env.ua.gecko > 0 && YAHOO.env.ua.gecko < 5 && (e = !1)) : e = !1), e ? void 0 : this.wp.msg("label.browserReport", "&lt;canvas&gt; element")) }, _isCanvasSupported: function() { var e = document.createElement("canvas"); return !(!e.getContext || !e.getContext("2d")) }, display: function() { return this.inDashlet = null != s.getAncestorByClassName(this.wp.getPreviewerElement(), "body") || null != s.getAncestorByClassName(this.wp.getPreviewerElement(), "yui-panel"), Alfresco.util.YUILoaderHelper.require(["tabview"], this.onComponentsLoaded, this), Alfresco.util.YUILoaderHelper.loadComponents(), this.wp.getPreviewerElement().innerHTML = "", null }, onComponentsLoaded: function() { this.workerSrc = Alfresco.constants.URL_CONTEXT + "res/components/preview/pdfjs/pdf.worker" + (Alfresco.constants.DEBUG ? ".js" : "-min.js"); for (var e = document.getElementsByTagName("script"), t = 0, i = e.length; t < i; t++)
                if (e[t].src.indexOf("components/preview/pdfjs/pdf.worker_") > -1) { this.workerSrc = e[t].src; break }
            this._loadDocumentConfig(), this.attributes.disabledPageLinking = "document-details" !== Alfresco.constants.PAGEID; var s = Alfresco.util.getQueryStringParameters(window.location.hash.replace("#", ""));
            this.disabledPageLinking ? this.pageNum = this.documentConfig.pageNum ? parseInt(this.documentConfig.pageNum) : this.pageNum : this.pageNum = s.page || (this.documentConfig.pageNum ? parseInt(this.documentConfig.pageNum) : this.pageNum), this.pageNum = parseInt(this.pageNum), Alfresco.util.Ajax.request({ url: Alfresco.constants.URL_SERVICECONTEXT + "components/preview/pdfjs?htmlid=" + encodeURIComponent(this.wp.id), successCallback: { fn: this.onViewerLoaded, scope: this }, failureMessage: this.wp.msg("error.viewerload") }), n.addListener(window, "resize", this.onRecalculatePreviewLayout, this, !0), n.addListener(window, "hashchange", this.onWindowHashChange, this, !0), n.addListener(window, "beforeunload", this.onWindowUnload, this, !0) }, onViewerLoaded: function(e) { this.wp.getPreviewerElement().innerHTML = e.serverResponse.responseText, this.controls = s.get(this.wp.id + "-controls"), this.pageNumber = s.get(this.wp.id + "-pageNumber"), this.sidebar = s.get(this.wp.id + "-sidebar"), this.viewer = s.get(this.wp.id + "-viewer"), "multi" == this.attributes.pageLayout && s.addClass(this.viewer, "multiPage"), this.widgets.sidebarButton = Alfresco.util.createYUIButton(this, "sidebarBtn", this.onSidebarToggle, { type: "checkbox", disabled: !0 }, this.wp.id + "-sidebarBtn"), this.widgets.nextButton = Alfresco.util.createYUIButton(this, "next", this.onPageNext, { disabled: !0 }, this.wp.id + "-next"), this.widgets.previousButton = Alfresco.util.createYUIButton(this, "previous", this.onPagePrevious, { disabled: !0 }, this.wp.id + "-previous"), n.addListener(this.wp.id + "-pageNumber", "change", this.onPageChange, this, !0), this.widgets.zoomOutButton = Alfresco.util.createYUIButton(this, "zoomOut", this.onZoomOut, { disabled: !0 }, this.wp.id + "-zoomOut"), this.widgets.zoomInButton = Alfresco.util.createYUIButton(this, "zoomIn", this.onZoomIn, { disabled: !0 }, this.wp.id + "-zoomIn"), this.widgets.scaleMenu = new YAHOO.widget.Button(this.wp.id + "-scaleSelectBtn", { type: "menu", menu: this.wp.id + "-scaleSelect", disabled: !0 }), this.widgets.scaleMenu.getMenu().subscribe("click", this.onZoomChange, null, this); var t = [{ text: this.wp.msg("link.download"), value: "", onclick: { fn: this.onDownloadClick, scope: this } }];
            this.attributes.src && t.push({ text: this.wp.msg("link.downloadPdf"), value: "", onclick: { fn: this.onDownloadPDFClick, scope: this } }), this.widgets.downloadButton = new YAHOO.widget.Button(this.wp.id + "-download", { type: "menu", menu: t }), ("document-details" === Alfresco.constants.PAGEID || "documentlibrary" === Alfresco.constants.PAGEID || window.location.pathname.match("/document-details$")) && (this.widgets.maximize = Alfresco.util.createYUIButton(this, "fullpage", this.onMaximizeClick, { title: this.wp.msg("button.maximize.tip", "macintosh" == YAHOO.env.ua.os ? this.wp.msg("key.meta") : this.wp.msg("key.ctrl")) }, this.wp.id + "-fullpage"), s.getElementsByClassName("maximizebutton", "span", this.controls, function(e) { s.setStyle(e, "display", "inline") }), s.getElementsByClassName("maximizebuttonSep", "span", this.controls, function(e) { s.setStyle(e, "display", "inline") })), "document-details" === Alfresco.constants.PAGEID && (s.getElementsByClassName("linkbutton", "span", this.controls, function(e) { s.setStyle(e, "display", "inline") }), this.widgets.linkBn = Alfresco.util.createYUIButton(this, "link", this.onLinkClick, { type: "checkbox" }, this.wp.id + "-link")), n.addListener(this.wp.id + "-findInput", "change", this.onFindChange, this, !0); var i = this; if (n.addListener(this.wp.id + "-findInput", "keypress", function(e) { 13 == e.keyCode && (n.stopEvent(e), i.onFindChange("find")) }), this.widgets.previousSearchButton = Alfresco.util.createYUIButton(this, "findPrevious", this.onFindChange, {}, this.wp.id + "-findPrevious"), this.widgets.nextSearchButton = Alfresco.util.createYUIButton(this, "findNext", this.onFindChange, {}, this.wp.id + "-findNext"), this.widgets.searchHighlight = Alfresco.util.createYUIButton(this, "findHighlightAll", this.onFindChangeHighlight, { type: "checkbox" }, this.wp.id + "-findHighlightAll"), this.widgets.searchMatchCase = Alfresco.util.createYUIButton(this, "findMatchCase", this.onFindChangeMatchCase, { type: "checkbox" }, this.wp.id + "-findMatchCase"), this.widgets.searchBarToggle = Alfresco.util.createYUIButton(this, "searchBarToggle", this.onToggleSearchBar, { type: "checkbox", disabled: !0, title: this.wp.msg("button.search.tip", "macintosh" == YAHOO.env.ua.os ? this.wp.msg("key.meta") : this.wp.msg("key.ctrl")) }, this.wp.id + "-searchBarToggle"), this.onPdfLoaded.subscribe(function(e, t) { this.widgets.sidebarButton.set("disabled", !1), this.widgets.scaleMenu.set("disabled", !1), this.widgets.searchBarToggle.set("disabled", !1) }, this, !0), this._setPreviewerElementHeight(), this._setViewerHeight(), this._loadPdf(), "document-details" === Alfresco.constants.PAGEID) { var a = function(e, t) { var i = t[1];
                        (i.ctrlKey || i.metaKey) && this.widgets.searchBarToggle && (n.stopEvent(i), i.newValue = !this.widgets.searchDialog || !this.widgets.searchDialog.cfg.getProperty("visible"), this.widgets.searchBarToggle.set("checked", !this.widgets.searchBarToggle.get("checked"))) },
                    o = function(e, t) { var i = t[1];
                        (i.ctrlKey || i.metaKey) && (n.stopEvent(i), this.onFullScreen(i)) };
                new YAHOO.util.KeyListener(document, { keys: 37 }, { fn: this.onPagePrevious, scope: this, correctScope: !0 }).enable(), new YAHOO.util.KeyListener(document, { keys: 39 }, { fn: this.onPageNext, scope: this, correctScope: !0 }).enable(), new YAHOO.util.KeyListener(document, { keys: 70, ctrl: !0 }, { fn: a, scope: this, correctScope: !0 }).enable(), new YAHOO.util.KeyListener(document, { keys: 13, ctrl: !0 }, { fn: o, scope: this, correctScope: !0 }).enable(), "macintosh" == YAHOO.env.ua.os && (new YAHOO.util.KeyListener(document, { keys: 13 }, { fn: o, scope: this, correctScope: !0 }).enable(), new YAHOO.util.KeyListener(document, { keys: 70 }, { fn: a, scope: this, correctScope: !0 }).enable()), n.addListener(window, "fullscreenchange", this.onFullScreenChange, this, !0), n.addListener(window, "mozfullscreenchange", this.onFullScreenChange, this, !0), n.addListener(window, "webkitfullscreenchange", this.onFullScreenChange, this, !0) }
            new YAHOO.util.KeyListener(document, { keys: 27 }, { fn: function(e) { this.maximized && this.onMaximizeClick() }, scope: this, correctScope: !0 }).enable() }, _setPreviewerElementHeight: function() { if (this.maximized) this.fullscreen || s.setStyle(this.wp.getPreviewerElement(), "height", (window.innerHeight || s.getViewportHeight()).toString() + "px");
            else { var e; if (this.inDashlet) s.setStyle(this.wp.getPreviewerElement(), "height", s.getClientHeight() - 64 + "px");
                else if (e = s.getAncestorByClassName(this.wp.getPreviewerElement(), "dijitDialogPaneContent")) { var t = s.getStyle(e, "height"),
                        i = parseInt(t) - 42 + "px";
                    s.setStyle(this.wp.getPreviewerElement(), "height", i) } else { var n = (new YAHOO.util.Element(this.wp.getPreviewerElement()), s.getDocumentHeight()),
                        a = s.getClientHeight(),
                        i = (n < a ? n : a) - 220;
                    s.setStyle(this.wp.getPreviewerElement(), "height", i + "px") } } }, _setViewerHeight: function() { var e = s.getRegion(this.viewer.parentNode),
                t = s.getRegion(this.controls),
                i = this.fullscreen ? 0 : t.height,
                n = e.height - i - 1; if (0 === n)
                if (this.maximized) n = s.getViewportHeight() - i - 1;
                else { var a; if (a = s.getAncestorByClassName(this.wp.getPreviewerElement(), "dijitDialogPaneContent")) { var o = s.getStyle(a, "height"),
                            r = parseInt(o) - 42 - 10 - i - 1 + "px";
                        s.setStyle(this.wp.getPreviewerElement(), "height", r) } else { var l = (new YAHOO.util.Element(this.wp.getPreviewerElement()), s.getDocumentHeight()),
                            h = s.getClientHeight(),
                            r = (l < h ? l : h) - 220;
                        n = r - 10 - i - 1 } }
            this.fullscreen ? (Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Setting viewer height to 100% (full-screen)"), s.setStyle(this.viewer, "height", "100%")) : (Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Setting viewer height to " + n + "px (toolbar " + i + "px, container " + e.height + "px"), s.setStyle(this.viewer, "height", n.toString() + "px"), s.setStyle(this.sidebar, "height", n.toString() + "px")) }, _loadPdf: function(e) { this.wp.options.name = this.wp.options.name.replace(/[^\w_\-\. ]/g, ""); var t = this.attributes.src ? this.wp.getThumbnailUrl(this.attributes.src) : this.wp.getContentUrl(); "http" !== t.substr(0, 4).toLowerCase() && (t = window.location.protocol + "//" + window.location.host + t), e = e || {}, e.url = t, "function" == typeof window.Spinner ? (this.spinner = new Spinner({ lines: 13, length: 7, width: 4, radius: 10, corners: 1, rotate: 0, color: "#666", speed: 1, trail: 60, shadow: !1, hwaccel: !1, className: "spinner", zIndex: 2e9, top: "auto", left: "auto" }).spin(this.viewer), this.onPdfLoaded.subscribe(function(e, t) { this.spinner.stop() }, this, !0)) : Alfresco.logger.error("spinner.js is not loaded!"), PDFJS.workerSrc = this.workerSrc, PDFJS.cMapUrl = "./cmaps/", PDFJS.cMapPacked = !0, "true" == this.attributes.progressiveLoading && 1 != PDFJS.disableRange ? (PDFJS.disableRange = !1, PDFJS.disableAutoFetch = !1) : PDFJS.disableRange = !0, Alfresco.logger.isDebugEnabled() && (Alfresco.logger.debug("Using PDFJS.disableRange=" + PDFJS.disableRange + " PDFJS.disableAutoFetch:" + PDFJS.disableAutoFetch), Alfresco.logger.debug("Loading PDF file from " + t)), PDFJS.getDocument(e).then(Alfresco.util.bind(this._onGetDocumentSuccess, this), Alfresco.util.bind(this._onGetDocumentFailure, this)) }, _onGetDocumentSuccess: function(e) { this.pdfDocument = e, this.numPages = this.pdfDocument.numPages, Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Rendering PDF with fingerprint " + e.fingerprint + " for " + this.wp.options.name), this._renderPdf(), this._updatePageControls(), this.onPdfLoaded.fire(e) }, _onGetDocumentFailure: function(e, t) { if (this.spinner && this.spinner.stop(), t && "PasswordException" === t.name) { var i = "prompt.password.text"; if ("incorrectpassword" === t.code && (i = "error.incorrectpassword"), "needpassword" === t.code || "incorrectpassword" === t.code) { var n = Alfresco.util.generateDomId(),
                        a = Alfresco.util.bind(function(e) { e && e.length > 0 && this._loadPdf({ password: e }) }, this),
                        r = Alfresco.util.PopupManager.getUserInput({ title: this.wp.msg("prompt.password.title"), html: '<label for="' + n + '">' + o(this.wp.msg(i)) + '</label><br/><br/><input id="' + n + '" tabindex="0" type="password" value=""/>', buttons: [{ text: Alfresco.util.message("button.ok", this.name), handler: function() { a(s.get(n).value), this.destroy() }, isDefault: !0 }, { text: Alfresco.util.message("button.cancel", this.name), handler: function() { this.destroy() } }] }),
                        l = r.getButtons()[0]; return YAHOO.util.Event.addListener(n, "keyup", function(e, t) { null != t && t.set("disabled", 0 == YAHOO.lang.trim(this.value || this.text || "").length) }, l), new YAHOO.util.KeyListener(n, { keys: [YAHOO.util.KeyListener.KEY.ENTER] }, function(e) { a(s.get(n).value), r.destroy() }).enable(), void(s.get(n) && s.get(n).focus()) } } var h = this.wp.msg("error.pdfload");
            t && "InvalidPDFException" === t.name && (h = this.wp.msg("error.invalidpdf")), Alfresco.util.PopupManager.displayMessage({ text: h }), Alfresco.logger.error("Could not load PDF due to error " + t.name + " (code " + t.code + "): " + e) }, _renderPdf: function() { for (var t = [], i = {}, n = this.numPages, a = 1; a <= n; a++) t.push(this.pdfDocument.getPage(a)); var o = Promise.all(t),
                r = this.pdfDocument.getDestinations(),
                h = Alfresco.util.bind(function(t) { var n = this;
                    this.documentView = new l(this.wp.id + "-viewer", { name: "documentView", pageLayout: this.attributes.pageLayout, currentScale: e, defaultScale: this.documentConfig.scale ? this.documentConfig.scale : this.attributes.defaultScale, disableTextLayer: "true" == this.attributes.disableTextLayer || YAHOO.env.ua.ios || YAHOO.env.ua.android, autoMinScale: parseFloat(s.getClientWidth() > 1024 ? this.attributes.autoMinScale : this.attributes.autoMinScaleMobile), autoMaxScale: parseFloat(this.attributes.autoMaxScale), pdfJsPlugin: n, pdfDocument: this.pdfDocument }), this.documentView.onScrollChange.subscribe(function() { var e = this.documentView.getScrolledPageNumber();
                        this.pageNum != e && (this.pageNum = e, this._updatePageControls(), this.documentView.setActivePage(this.pageNum)) }, this, !0), this.thumbnailView = null, this.pages = t, this.documentView.addPages(t); for (var a = 0; a < t.length; a++) { var o = t[a],
                            r = o.ref;
                        i[r.num + " " + r.gen + " R"] = a } if (this.documentView.render(), this.pageNum > this.pdfDocument.numPages && (this.pageNum = this.pdfDocument.numPages, this._updatePageControls()), this.documentView.scrollTo(this.pageNum), this.documentView.setActivePage(this.pageNum), this._updateZoomControls(), s.get(this.wp.id + "-numPages").textContent = this.numPages, s.setAttribute(this.wp.id + "-pageNumber", "max", this.numPages), s.setAttribute(this.wp.id + "-pageNumber", "disabled", this.numPages > 1 ? null : "disabled"), s.get(this.wp.id + "-pageNumber").removeAttribute("disabled"), "true" == this.attributes.autoSearch && document.referrer && document.referrer.indexOf("/search?") > 0) { var h = Alfresco.util.getQueryStringParameter("t", document.referrer);
                        h && (this.widgets.searchBarToggle.set("checked", !0), s.get(this.wp.id + "-findInput").value = h, this.onFindChange("find")) } }, this),
                c = Alfresco.util.bind(function(e) { this.destinations = e }, this),
                d = Alfresco.util.bind(function(e) { this._addOutline(e) }, this),
                g = Alfresco.util.bind(function() { this.pdfDocument.getOutline().then(d) }, this);
            o.then(h), this.pagesRefMap = i, r.then(c), Promise.all([o, r]).then(g) }, _updatePageControls: function() { this.pageNumber.value = this.pageNum, this.widgets.nextButton.set("disabled", this.pageNum >= this.pdfDocument.numPages), this.widgets.previousButton.set("disabled", this.pageNum <= 1) }, _updateZoomControls: function(e) { var s = this.documentView.currentScale;
            this.widgets.zoomInButton.set("disabled", s * this.attributes.scaleDelta > i), this.widgets.zoomOutButton.set("disabled", s / this.attributes.scaleDelta < t), this.widgets.scaleMenu.set("label", "" + Math.round(100 * s) + "%") }, _scrollToPage: function(e) { this.documentView.removeScrollListener(), this.documentView.scrollTo(e), this.documentView.setActivePage(this.pageNum), this.pageNum = e, this._updatePageControls(), this.thumbnailView && this.thumbnailView.pages && this.thumbnailView.pages[0] && this.thumbnailView.pages[0].container && this.thumbnailView.setActivePage(this.pageNum), YAHOO.lang.later(50, this.documentView, this.documentView.addScrollListener) }, _addOutline: function(e) { var t = s.get(this.wp.id + "-outlineView"); if (e && e.length > 0)
                for (var i = [{ parent: t, items: e }]; i.length > 0;) { var n, a = i.shift(),
                        o = a.items.length; for (n = 0; n < o; n++) { var r = a.items[n],
                            l = document.createElement("div");
                        l.className = "outlineItem"; var h = document.createElement("a"); if (s.setAttribute(h, "href", "#"), YAHOO.util.Event.addListener(h, "click", function(e, t) { YAHOO.util.Event.stopEvent(e), this._navigateTo(t) }, r.dest, this), h.textContent = r.title, l.appendChild(h), r.items.length > 0) { var c = document.createElement("div");
                            c.className = "outlineItems", l.appendChild(c), i.push({ parent: c, items: r.items }) }
                        a.parent.appendChild(l) } } else t.innerHTML = "<p>" + this.wp.msg("msg.noOutline") + "</p>" }, _navigateTo: function(e) { if ("string" == typeof e && (e = this.destinations[e]), e instanceof Array) { var t = e[0],
                    i = t instanceof Object ? this.pagesRefMap[t.num + " " + t.gen + " R"] : t + 1;
                i > this.documentView.pages.length - 1 && (i = this.documentView.pages.length - 1), "number" == typeof i && this._scrollToPage(i + 1) } }, _loadDocumentConfig: function() { if ("true" == this.attributes.useLocalStorage && this._browserSupportsHtml5Storage()) { var e = "org.alfresco.pdfjs.document." + this.wp.options.nodeRef.replace(":/", "").replace("/", ".") + ".";
                this.documentConfig = { pageNum: window.localStorage[e + "pageNum"], scale: window.localStorage[e + "scale"] }, "null" == this.documentConfig.scale && (this.documentConfig.scale = null) } else this.documentConfig = {} }, _browserSupportsHtml5Storage: function() { try { return "localStorage" in window && null !== window.localStorage } catch (e) { return !1 } }, onSidebarToggle: function(e) { var t = "block" == s.getStyle(this.sidebar, "display");
            s.setStyle(this.sidebar, "display", t ? "none" : "block"), t ? s.removeClass(this.viewer, "sideBarVisible") : (s.addClass(this.viewer, "sideBarVisible"), this.thumbnailView || (this.thumbnailView = new l(this.wp.id + "-thumbnailView", { name: "thumbnailView", pageLayout: "single", defaultScale: "page-width", disableTextLayer: !0, pdfJsPlugin: this }), this.thumbnailView.addPages(this.pages))), this.documentView.alignRows(), this.documentView.setScale(this.documentView.parseScale(this.currentScaleSelection ? this.currentScaleSelection : this.attributes.defaultScale)), this._scrollToPage(this.pageNum), this.documentView.renderVisiblePages(); if (this.widgets.tabview = this.widgets.tabview || new YAHOO.widget.TabView(this.wp.id + "-sidebarTabView"), this.thumbnailView && this.thumbnailView.pages.length > 0 && !this.thumbnailView.pages[0].container) { this.thumbnailView.render(); for (var i = 0; i < this.thumbnailView.pages.length; i++) YAHOO.util.Event.addListener(this.thumbnailView.pages[i].container, "click", function(e, t) { this.thumbnailView.setActivePage(t.pn), this.documentView.scrollTo(t.pn) }, { pn: i + 1 }, this);
                this.thumbnailView.scrollTo(this.pageNum), this.thumbnailView.setActivePage(this.pageNum) } }, onPagePrevious: function(e) { this.pageNum <= 1 || (this.pageNum--, this._scrollToPage(this.pageNum)) }, onPageNext: function(e) { this.pageNum < this.pdfDocument.numPages && (this.pageNum++, this._scrollToPage(this.pageNum)) }, onFullScreen: function(e) { var t = this.viewer;
            document.fullScreenElement && null !== document.fullScreenElement || !document.mozFullScreenElement && !document.webkitFullScreenElement && !document.webkitFullscreenElement ? (n.removeListener(window, "resize", this.onRecalculatePreviewLayout, this, !0), t.requestFullScreen ? t.requestFullScreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullScreen && t.webkitRequestFullScreen(a.ALLOW_KEYBOARD_INPUT)) : document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen() }, onFullScreenChange: function(e) { document.fullScreenElement && null !== document.fullScreenElement || !document.mozFullScreenElement && !document.webkitFullScreenElement && !document.webkitFullscreenElement ? (Alfresco.logger.debug("Leaving full screen mode"), this.fullscreen = !1, this.documentView.fullscreen = !1, this.documentView.setScale(this.oldScale), this._setViewerHeight(), this.onResize.fire(), this.documentView.alignRows(), this._scrollToPage(this.pageNum), n.addListener(window, "resize", this.onRecalculatePreviewLayout, this, !0)) : (Alfresco.logger.debug("Entering full screen mode"), this.documentView.fullscreen = !0, this.fullscreen = !0, this.oldScale = this.documentView.currentScale, this.oldPageNum = this.pageNum, this._setViewerHeight(), this.onResize.fire(), this.documentView.setScale(this.documentView.parseScale("page-fit")), this.documentView.alignRows(), this._scrollToPage(this.pageNum)) }, onPageChange: function(e) { var t = parseInt(e.currentTarget.value);
            t < 1 || t > this.numPages ? Alfresco.util.PopupManager.displayMessage({ text: this.wp.msg("error.badpage") }) : (this.pageNum = t, this._scrollToPage(this.pageNum)) }, onToggleSearchBar: function(e) { if (this.widgets.searchDialog || (this.widgets.searchDialog = new YAHOO.widget.SimpleDialog(this.wp.id + "-searchDialog", { close: !1, draggable: !1, effect: null, modal: !1, visible: !1, width: "265px", context: [this.viewer, "tr", "tr", ["beforeShow", "windowResize"],
                        [-20, 3]
                    ], underlay: "none" }), this.widgets.searchDialog.render(), new YAHOO.util.KeyListener(s.get(this.wp.id + "-searchDialog"), { keys: 27 }, { fn: function(e, t) { if (this.widgets.searchBarToggle.get("checked")) { var i = t[1];
                            n.stopEvent(i), this.widgets.searchBarToggle.set("checked", !1) } }, scope: this, correctScope: !0 }).enable()), this.widgets.linkBn && this.widgets.linkBn.get("checked") === !0 && this.widgets.linkBn.set("checked", !1), e.newValue === !0) { this.widgets.searchDialog.show(), this.widgets.searchDialog.bringToTop(); var t = s.get(this.wp.id + "-findInput");
                t.focus(), t.select(), p.pdfPageSource || (p.initialize({ pdfPageSource: this.documentView }), p.resolveFirstPage()), p.reset(), p.extractText() } else this.widgets.searchDialog.hide(), p.active = !1 }, onFindChangeMatchCase: function(e) { this.onFindChange("casesensitivitychange") }, onFindChangeHighlight: function(e) { this.onFindChange("highlightallchange") }, onFindChange: function(e) { var t = s.get(this.wp.id + "-findInput").value; if (t) { var i, n = document.createEvent("CustomEvent"),
                    a = !1,
                    o = "find",
                    r = this.widgets.searchHighlight.get("checked"),
                    l = this.widgets.searchMatchCase.get("checked"); switch (i = e.currentTarget ? e.currentTarget.id : e) {
                    case this.wp.id + "-findNext":
                        o += "again"; break;
                    case this.wp.id + "-findPrevious":
                        o += "again", a = !0; break;
                    case "highlightallchange":
                        o += "highlightallchange"; break;
                    case "casesensitivitychange":
                        o += "casesensitivitychange"; break;
                    default:
                        if (t === this.lastSearchQuery) { o += "again"; break } }
                this.lastSearchQuery = t, n.initCustomEvent(o, !0, !0, { query: t, caseSensitive: l, highlightAll: r, findPrevious: a }), window.dispatchEvent(n) } }, onZoomOut: function(e) { var i = Math.max(t, this.documentView.currentScale / this.attributes.scaleDelta);
            this.documentView.setScale(this.documentView.parseScale(i)), this._scrollToPage(this.pageNum), this._updateZoomControls() }, onZoomIn: function(e) { var t = Math.min(i, this.documentView.currentScale * this.attributes.scaleDelta);
            this.documentView.setScale(this.documentView.parseScale(t)), this._scrollToPage(this.pageNum), this._updateZoomControls() }, onZoomChange: function(e, t) { var i = (t[0], t[1]);
            this.currentScaleSelection = i.value, this.documentView.setScale(this.documentView.parseScale(i.value)), this._scrollToPage(this.pageNum), this._updateZoomControls() }, onDownloadClick: function(e) { window.open(this.wp.getContentUrl(!0).replace("api/node", "slingshot/node"), "_blank") }, onDownloadPDFClick: function(e) { window.open(this.wp.getThumbnailUrl(this.attributes.src) + "&a=true", "_blank") }, onMaximizeClick: function(e) { this.maximized = !this.maximized, this.maximized ? (s.addClass(this.wp.getPreviewerElement(), "fullPage"), this.widgets.maximize.set("label", this.wp.msg("button.minimize")), this.widgets.maximize.set("title", this.wp.msg("button.minimize.tip", "macintosh" == YAHOO.env.ua.os ? this.wp.msg("key.meta") : this.wp.msg("key.ctrl")))) : (s.removeClass(this.wp.getPreviewerElement(), "fullPage"), this.widgets.maximize.set("label", this.wp.msg("button.maximize")), this.widgets.maximize.set("title", this.wp.msg("button.maximize.tip", "macintosh" == YAHOO.env.ua.os ? this.wp.msg("key.meta") : this.wp.msg("key.ctrl")))), this._setPreviewerElementHeight(), this._setViewerHeight(), this.onResize.fire(), this.documentView.setScale(this.documentView.parseScale(this.currentScaleSelection ? this.currentScaleSelection : this.attributes.defaultScale)), this._scrollToPage(this.pageNum), this.documentView.alignRows(), this.documentView.renderVisiblePages(), this.thumbnailView && this.thumbnailView.renderVisiblePages(), this.widgets.searchDialog && this.widgets.searchDialog.align("tr", "tr"), this.widgets.linkDialog && this.widgets.linkDialog.align("tr", "tr") }, onLinkClick: function(e) { var t = this.wp.id + "-linkDialog",
                i = t + "-input",
                a = function() { var e = this.widgets.linkDialogBg.get("checkedButton").get("id"),
                        t = window.location.href.replace(window.location.hash, "") + (e.indexOf("-doc") > 0 ? "" : "#page=" + this.pageNum),
                        n = s.get(i);
                    n.value = t, n.focus(), n.select() }; if (!this.widgets.linkDialog) { var o = new YAHOO.widget.SimpleDialog(t, { close: !1, draggable: !1, effect: null, modal: !1, visible: !1, context: [this.viewer, "tr", "tr", ["beforeShow", "windowResize"],
                        [-20, 3]
                    ], width: "40em", underlay: "none" });
                window.location.href.replace(window.location.hash, "") + "#page=" + this.pageNum;
                o.render(), new YAHOO.util.KeyListener(s.get(t), { keys: 27 }, { fn: function(e, t) { if (this.widgets.linkBn.get("checked")) { var i = t[1];
                            n.stopEvent(i), this.widgets.linkBn.set("checked", !1) } }, scope: this, correctScope: !0 }).enable(); for (var r = new YAHOO.widget.ButtonGroup(t + "-bg"), l = 0; l < r.getCount(); l++) r.getButton(l).addListener("click", a, null, this);
                this.widgets.linkDialogBg = r, this.widgets.linkDialog = o, YAHOO.util.Event.addListener(i, "click", function() { this.focus(), this.select() }) }
            this.widgets.searchBarToggle.get("checked") === !0 && this.widgets.searchBarToggle.set("checked", !1), this.widgets.linkDialog.cfg.getProperty("visible") ? this.widgets.linkDialog.hide() : (this.widgets.linkDialog.show(), this.widgets.linkDialog.bringToTop(), a.call(this)) }, onRecalculatePreviewLayout: function(e) { this.documentView && (Alfresco.logger.debug("onRecalculatePreviewLayout"), this._setPreviewerElementHeight(), this._setViewerHeight(), this.onResize.fire(), this.documentView.setScale(this.documentView.parseScale(this.currentScaleSelection ? this.currentScaleSelection : this.attributes.defaultScale)), this._scrollToPage(this.pageNum), this.documentView.alignRows(), this.documentView.renderVisiblePages()), this.thumbnailView && this.thumbnailView.renderVisiblePages() }, onWindowHashChange: function(e) { if (!this.disabledPageLinking) { var t = Alfresco.util.getQueryStringParameters(window.location.hash.replace("#", ""));
                pn = t.page, pn && (pn > this.pdfDocument.numPages ? pn = this.pdfDocument.numPages : pn < 1 && (pn = 1), this.pageNum = parseInt(pn), this._scrollToPage(this.pageNum)) } }, onWindowUnload: function() { if ("true" == this.attributes.useLocalStorage && this._browserSupportsHtml5Storage() && this.documentView) { var e = "org.alfresco.pdfjs.document." + this.wp.options.nodeRef.replace(":/", "").replace("/", ".") + ".";
                this.pageNum && (window.localStorage[e + "pageNum"] = this.pageNum), this.documentView.lastScale && (window.localStorage[e + "scale"] = this.documentView.lastScale), this.widgets.sidebarButton && (window.localStorage[e + "sidebar-enabled"] = this.widgets.sidebarButton.get("checked")) } } };
    var r = function(e, t, i, s, n) { this.id = e, this.content = t, this.parent = i, this.canvas = null, this.container = null, this.loadingIconDiv = null, this.textLayerDiv = null, this.config = s || {}, this.textContent = null, this.annotationLayerDiv = null, this.pdfJsPlugin = n };
    r.prototype = { render: function() { var e = document.createElement("div");
            e.id = this.parent.id + "-pageContainer-" + this.id, s.addClass(e, "page"), this.parent.viewer.appendChild(e); var t = document.createElement("div");
            s.addClass(t, "loadingIcon"), e.appendChild(t), this.container = e, this.loadingIconDiv = t, this._setPageSize() }, getRegion: function() { return s.getRegion(this.container) }, getVPos: function(e) { return this.container.getBoundingClientRect().top + s.getDocumentScrollTop() - this.parent.viewerRegion.top }, renderContent: function() { var e = this.getRegion(),
                t = document.createElement("canvas");
            t.id = this.container.id.replace("-pageContainer-", "-canvas-"), t.mozOpaque = !0, this.container.appendChild(t), this.canvas = t, s.setStyle(t, "visibility", "hidden"), t.width = e.width, t.height = e.height; var i = this.content.getViewport(this.parent.currentScale),
                n = null;
            this.parent.config.disableTextLayer || (n = document.createElement("div"), n.className = "textLayer", this.container.appendChild(n)), this.textLayerDiv = n, this.textLayer = n ? new d(n, this.id - 1, this.pdfJsPlugin, i) : null; var a = null;
            this.parent.config.disableAnnotationLayer || (a = document.createElement("div"), a.className = "annotationLayer", this.container.appendChild(a)), this.annotationLayerDiv = a, this.annotationLayer = a ? new g(a) : null; var o = this.content,
                r = (o.view, t.getContext("2d")),
                l = { canvasContext: r, viewport: i, textLayer: this.textLayer, annotationLayer: this.annotationLayer },
                h = 0;
            Alfresco.logger.isDebugEnabled() && (h = Date.now()); var c = Alfresco.util.bind(function(e) { this.textLayer.setTextContent(e) }, this),
                u = Alfresco.util.bind(function() { this.textLayer && this.getTextContent().then(c), this.annotationLayer && this.annotationLayer.render(this, this.content, i), this.loadingIconDiv && s.setStyle(this.loadingIconDiv, "display", "none"), s.setStyle(this.canvas, "visibility", "visible"), Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Rendered " + this.parent.name + " page " + this.id + " in " + (Date.now() - h) + "ms") }, this);
            o.render(l).promise.then(u) }, _setPageSize: function(e) { var t = this.content.getViewport(this.parent.currentScale);
            s.setStyle(this.container, "height", Math.floor(t.height) + "px"), s.setStyle(this.container, "width", Math.floor(t.width) + "px") }, reset: function() { this._setPageSize(), this.canvas && (this.container.removeChild(this.canvas), delete this.canvas, this.canvas = null), this.loadingIconDiv && s.setStyle(this.loadingIconDiv, "display", "block") }, getTextContent: function() { return this.textContent || (this.textContent = this.content.getTextContent()), this.textContent }, scrollIntoView: function(e, t) { var i = 0;
            Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Page Scroll"), e && (i += e.offsetTop, Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Page Scroll offsetTop " + e.offsetTop)), t && (Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Page Scroll spot " + t.top), i += t.top), Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Page Scroll " + i), this.parent.scrollTo(this.id, i) } };
    var l = function(t, i) { this.id = t, this.config = i || {}, this.pages = [], this.viewer = s.get(t), this.viewerRegion = s.getRegion(this.viewer), this.currentScale = i.currentScale || e, this.name = this.config.name || "", this.pdfJsPlugin = i.pdfJsPlugin, this.pdfDocument = i.pdfDocument, this.lastScroll = 0; var n = this;
        this.viewer.addEventListener("scroll", function() { n.lastScroll = Date.now() }, !1), this.pdfJsPlugin.onResize.subscribe(this.onResize, this, !0), this.addScrollListener(), this.onScrollChange = new YAHOO.util.CustomEvent("scrollChange", this) };
    l.prototype = {
        activePage: null,
        lastScale: null,
        renderOnScrollZero: 0,
        addPage: function(e, t) { var i = new r(e, t, this, {}, this.pdfJsPlugin);
            this.pages.push(i) },
        addPages: function(e) { for (var t = 0; t < e.length; t++) { var i = e[t];
                this.addPage(t + 1, i) } },
        render: function() { for (var t = 0; t < this.pages.length; t++) Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Rendering " + this.name + " page container " + (t + 1)), this.pages[t].render();
            this.currentScale === e ? this.setScale(this.parseScale(this.config.defaultScale)) : this.alignRows() },
        reset: function() { for (var e = 0; e < this.pages.length; e++) this.pages[e].reset();
            this.alignRows() },
        alignRows: function() { var e = -1,
                t = 0,
                i = 0,
                n = s.getDocumentScrollTop(); if ("multi" == this.config.pageLayout) { s.setStyle(this.viewer, "padding-left", "0px"); for (var a = 0; a < this.pages.length; a++) { var o = this.pages[a],
                        r = o.container,
                        l = r.getBoundingClientRect(),
                        h = l.top + n - o.parent.viewerRegion.top,
                        c = parseInt(s.getStyle(r, "margin-left"));
                    h != e && (t = c), t += l.width + c, i = Math.max(i, t), e = h }
                s.setStyle(this.viewer, "padding-left", Math.floor((this.viewer.clientWidth - i) / 2) + "px") } },
        renderVisiblePages: function() {
            this.viewerRegion = s.getRegion(this.viewer);
            var e = this.viewerRegion.height,
                t = this.viewerRegion.top,
                i = s.getDocumentScrollTop();
            Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Render " + this.name + " visible pages: viewer height " + this.viewerRegion.height + "px");
            for (var n = 0; n < this.pages.length; n++) { var a = this.pages[n]; if (!a.canvas) { var o = a.container.getBoundingClientRect(),
                        r = o.top + i - t,
                        l = r + o.height,
                        h = 1.5;
                    (r < 0 && 0 < l || -e * h < l && l < e || 0 < r && r < e * (h + 1)) && (Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Rendering " + this.name + " page " + (n + 1) + " content (page top:" + r + ", bottom:" + l + ")"), a.renderContent()) } }
        },
        scrollTo: function(e, t) { var i = this.pages[e - 1].getVPos(),
                s = this.pages[0].getVPos();
            Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Scrolling " + this.name + " to page " + e + ". New page top is " + i + "px. First page top is " + s + "px"); var n = i - s;
            t && (n += t), Alfresco.logger.isDebugEnabled() && (Alfresco.logger.debug("Old scrollTop was " + this.viewer.scrollTop + "px"), Alfresco.logger.debug("Set scrollTop to " + n + "px"), Alfresco.logger.debug("scrollTop offsetY " + t)), this.viewer.scrollTop = n, this.pageNum = e, this.renderVisiblePages() },
        setScale: function(e) { e != this.currentScale && (Alfresco.logger.isDebugEnabled() && Alfresco.logger.debug("Scale is now " + e), this.currentScale = e, this.reset(), this.alignRows()) },
        parseScale: function(e) { var t = parseFloat(e); if (t) return this.lastScale = e, t; if (0 === this.pages.length) throw "Unrecognised zoom level - no pages"; var i = this.pages[0],
                n = i.container,
                a = parseInt(s.getStyle(n, "margin-left")) + parseInt(s.getStyle(n, "margin-right")),
                o = parseInt(s.getStyle(n, "margin-top")),
                r = parseInt(i.content.pageInfo.view[2]),
                l = parseInt(i.content.pageInfo.view[3]),
                h = i.content.pageInfo.rotate,
                c = this.fullscreen ? window.screen.width : this.viewer.clientWidth - 1,
                d = this.fullscreen ? window.screen.height : this.viewer.clientHeight; if (Alfresco.logger.debug("Client height: " + this.viewer.clientHeight), 90 === h || 270 === h) { var g = r;
                r = l, l = g } switch (e) {
                case "page-width":
                    var u = (c - 2 * a) / r;
                    t = u; break;
                case "two-page-width":
                    var u = (c - 3 * a) / r;
                    t = u / 2; break;
                case "page-height":
                    var p = (d - 2 * o) / l;
                    t = p; break;
                case "page-fit":
                    var u = (c - 2 * a) / r,
                        p = (d - 2 * o) / l;
                    t = Math.min(u, p); break;
                case "two-page-fit":
                    var u = (c - 3 * a) / r,
                        p = (d - 2 * o) / l;
                    t = Math.min(u / 2, p); break;
                case "auto":
                    var m = this.parseScale("two-page-fit"),
                        f = this.parseScale("page-fit"),
                        w = this.parseScale("page-width"),
                        v = this.parseScale("two-page-width"),
                        b = this.config.autoMinScale,
                        S = this.config.autoMaxScale;
                    t = m > b && this.numPages > 1 ? m : f > b ? f : v > b && this.numPages > 1 ? v : w > b ? w : b, S && (t = Math.min(t, S)); break;
                default:
                    throw "Unrecognised zoom level '" + e + "'" } return this.lastScale = e, t },
        getScrolledPageNumber: function() { for (var e = 0; e < this.pages.length; e++) { var t = this.pages[e],
                    i = t.getVPos(); if (i + parseInt(t.container.style.height) / 2 > 0) return e + 1 } return this.pages.length },
        setActivePage: function(e) { this.activePage && s.removeClass(this.activePage.container, "activePage"), s.addClass(this.pages[e - 1].container, "activePage"), this.activePage = this.pages[e - 1] },
        onResize: function() { this.viewerRegion = s.getRegion(this.viewer) },
        addScrollListener: function() { n.addListener(this.viewer, "scroll", this.onScrollEvent, this, !0) },
        removeScrollListener: function() { n.removeListener(this.viewer, "scroll", this.onScrollEvent) },
        onScrollEvent: function(e) { this.renderOnScrollZero++, YAHOO.lang.later(50, this, this.onScroll, e) },
        onScroll: function(e) { this.renderOnScrollZero--, 0 == this.renderOnScrollZero && (this.renderVisiblePages(), this.onScrollChange.fire(this)) }
    };
    var h = -50,
        c = -400,
        d = function(e, t, i, n) { var a = document.createDocumentFragment();
            this.textDivs = [], this.viewport = n, this.textLayerDiv = e, this.layoutDone = !1, this.divContentDone = !1, this.pageIdx = t, this.matches = [], this.pdfJsPlugin = i, this.isViewerInPresentationMode = !1, "undefined" == typeof p && (window.PDFFindController = null), "undefined" == typeof this.lastScrollSource && (this.lastScrollSource = null), this.renderLayer = function() { var e = this.textDivs,
                    t = document.createElement("canvas"),
                    i = t.getContext("2d"),
                    n = 1e5; if (!(e.length > n)) { for (var o = 0, r = e.length; o < r; o++) { var l = e[o]; if (!("isWhitespace" in l.dataset)) { i.font = l.style.fontSize + " " + l.style.fontFamily; var h = i.measureText(l.textContent).width; if (h > 0) { a.appendChild(l); var c = l.dataset.canvasWidth / h,
                                    d = l.dataset.angle,
                                    g = "scale(" + c + ", 1)";
                                g = "rotate(" + d + "deg) " + g, s.setStyle(l, "-ms-transform", "scale(" + c + ", 1)"), s.setStyle(l, "-webkit-transform", "scale(" + c + ", 1)"), s.setStyle(l, "-moz-transform", "scale(" + c + ", 1)"), s.setStyle(l, "-ms-transformOrigin", "0% 0%"), s.setStyle(l, "-webkit-transformOrigin", "0% 0%"), s.setStyle(l, "-moz-transformOrigin", "0% 0%") } } }
                    this.textLayerDiv.appendChild(a), this.renderingDone = !0, this.updateMatches() } }, this.setupRenderLayoutTimer = function() { var e = 200,
                    t = this,
                    i = null === this.lastScrollSource ? 0 : this.lastScrollSource.lastScroll;
                Date.now() - i > e ? this.renderLayer() : (this.renderTimer && clearTimeout(this.renderTimer), this.renderTimer = setTimeout(function() { t.setupRenderLayoutTimer() }, e)) }, this.appendText = function(e, t) { var i = t[e.fontName],
                    s = document.createElement("div"); if (this.textDivs.push(s), !/\S/.test(e.str)) return void(s.dataset.isWhitespace = !0); var n = PDFJS.Util.transform(this.viewport.transform, e.transform),
                    a = Math.atan2(n[1], n[0]);
                i.vertical && (a += Math.PI / 2); var o = Math.sqrt(n[2] * n[2] + n[3] * n[3]),
                    r = i.ascent ? i.ascent * o : i.descent ? (1 + i.descent) * o : o;
                s.style.position = "absolute", s.style.left = n[4] + r * Math.sin(a) + "px", s.style.top = n[5] - r * Math.cos(a) + "px", s.style.fontSize = o + "px", s.style.fontFamily = i.fontFamily, s.textContent = e.str, s.dataset.fontName = e.fontName, s.dataset.angle = a * (180 / Math.PI), i.vertical ? s.dataset.canvasWidth = e.height * this.viewport.scale : s.dataset.canvasWidth = e.width * this.viewport.scale }, this.setTextContent = function(e) { this.textContent = e; for (var t = e.items, i = 0; i < t.length; i++) this.appendText(t[i], e.styles);
                this.divContentDone = !0, this.setupRenderLayoutTimer() }, this.convertMatches = function(e) { for (var t = 0, i = 0, s = this.textContent.items, n = s.length - 1, a = null === p ? 0 : p.state.query.length, o = [], r = 0; r < e.length; r++) { for (var l = e[r]; t !== n && l >= i + s[t].str.length;) i += s[t].str.length, t++;
                    t == s.length && console.error("Could not find matching mapping"); var h = { begin: { divIdx: t, offset: l - i } }; for (l += a; t !== n && l > i + s[t].str.length;) i += s[t].str.length, t++;
                    h.end = { divIdx: t, offset: l - i }, o.push(h) } return o }, this.renderMatches = function(e) {
                function t(e, t) { var i = e.divIdx,
                        n = r[i];
                    n.textContent = "", s(i, 0, e.offset, t) }

                function i(e, t, i) { s(e.divIdx, e.offset, t.offset, i) }

                function s(e, t, i, s) { var n = r[e],
                        a = o[e].str.substring(t, i),
                        l = document.createTextNode(a); if (s) { var h = document.createElement("span"); return h.className = s, h.appendChild(l), void n.appendChild(h) }
                    n.appendChild(l) }

                function n(e, t) { r[e].className = t } if (0 !== e.length) { var a, o = this.textContent.items,
                        r = this.textDivs,
                        l = null,
                        d = null !== p && this.pageIdx === p.selected.pageIdx,
                        g = null === p ? -1 : p.selected.matchIdx,
                        u = null !== p && p.state.highlightAll,
                        m = { divIdx: -1, offset: void 0 },
                        f = g,
                        w = f + 1; if (u) f = 0, w = e.length;
                    else if (!d) return; for (a = f; a < w; a++) { var v = e[a],
                            b = v.begin,
                            S = v.end,
                            P = d && a === g,
                            x = P ? " selected" : ""; if (P && !this.isViewerInPresentationMode && this.pdfJsPlugin.documentView.pages[this.pageIdx].scrollIntoView(r[b.divIdx], { top: h, left: c }), l && b.divIdx === l.divIdx ? i(l, b) : (null !== l && i(l, m), t(b)), b.divIdx === S.divIdx) i(b, S, "highlight" + x);
                        else { i(b, m, "highlight begin" + x); for (var y = b.divIdx + 1; y < S.divIdx; y++) n(y, "highlight middle" + x);
                            t(S, "highlight end" + x) }
                        l = S }
                    l && i(l, m) } }, this.updateMatches = function() { if (this.renderingDone) { for (var e = this.matches, t = this.textDivs, i = this.textContent.items, s = -1, n = 0; n < e.length; n++) { for (var a = e[n], o = Math.max(s, a.begin.divIdx), r = o; r <= a.end.divIdx; r++) { var l = t[r];
                            l.textContent = i[r].str, l.className = "" }
                        s = a.end.divIdx + 1 }
                    null !== p && p.active && (this.matches = e = this.convertMatches(null === p ? [] : p.pageMatches[this.pageIdx] || []), this.renderMatches(this.matches)) } } },
        g = function(e) { this.annotationLayerDiv = e, this.render = function(e, t, i) { var s = "display";
                e.viewport = i; var n = { intent: void 0 === s ? "display" : s };
                t.getAnnotations(n).then(function(i) { var s = e.viewport.clone({ dontFlip: !0 });
                    n = { viewport: s, div: e.annotationLayerDiv, annotations: i, page: t, linkService: e.linkService, downloadManager: e.downloadManager }, e.annotationLayerDiv ? PDFJS.AnnotationLayer.render(n) : console.warn("Annotation DIV does not exist") }) }, this.hide = function() { this.annotationLayerDiv && this.annotationLayerDiv.setAttribute("hidden", "true") } },
        u = { FIND_FOUND: 0, FIND_NOTFOUND: 1, FIND_WRAPPED: 2, FIND_PENDING: 3 },
        p = { startedTextExtraction: !1, extractTextPromises: [], pendingFindMatches: {}, active: !1, pageContents: [], pageMatches: [], selected: { pageIdx: -1, matchIdx: -1 }, offset: { pageIdx: null, matchIdx: null }, resumePageIdx: null, state: null, dirtyMatch: !1, findTimeout: null, pdfPageSource: null, integratedFind: !1, initialize: function(e) { this.pdfPageSource = e.pdfPageSource, this.integratedFind = e.integratedFind; var t = ["find", "findagain", "findhighlightallchange", "findcasesensitivitychange"];
                this.firstPagePromise = new Promise(function(e) { this.resolveFirstPage = e }.bind(this)), this.handleEvent = this.handleEvent.bind(this); for (var i = 0; i < t.length; i++) window.addEventListener(t[i], this.handleEvent) }, reset: function() { this.startedTextExtraction = !1, this.extractTextPromises = [], this.active = !1 }, calcFindMatch: function(e) { var t = this.pageContents[e],
                    i = this.state.query,
                    s = this.state.caseSensitive,
                    n = i.length; if (0 !== n) { s || (t = t.toLowerCase(), i = i.toLowerCase()); for (var a = [], o = -n;;) { if (o = t.indexOf(i, o + n), o === -1) break;
                        a.push(o) }
                    this.pageMatches[e] = a, this.updatePage(e), this.resumePageIdx === e && (this.resumePageIdx = null, this.nextPageMatch()) } }, extractText: function() {
                function e(i) { n.pdfPageSource.pages[i].getTextContent().then(function(s) { for (var a = s.items, o = "", r = 0; r < a.length; r++) o += a[r].str;
                        n.pageContents.push(o), t[i](i), i + 1 < n.pdfPageSource.pages.length && e(i + 1) }) } if (!this.startedTextExtraction) { this.startedTextExtraction = !0, this.pageContents = []; for (var t = [], i = 0, s = this.pdfPageSource.pdfDocument.numPages; i < s; i++) this.extractTextPromises.push(new Promise(function(e) { t.push(e) })); var n = this;
                    e(0) } }, handleEvent: function(e) { null !== this.state && "findagain" === e.type || (this.dirtyMatch = !0), this.state = e.detail, this.updateUIState(u.FIND_PENDING), this.firstPagePromise.then(function() { this.extractText(), clearTimeout(this.findTimeout), "find" === e.type ? this.findTimeout = setTimeout(this.nextMatch.bind(this), 250) : this.nextMatch() }.bind(this)) }, updatePage: function(e) { var t = this.pdfPageSource.pages[e];
                this.selected.pageIdx === e && t.scrollIntoView(), t.textLayer && t.textLayer.updateMatches() }, nextMatch: function() { var e = this.state.findPrevious,
                    t = this.pdfPageSource.pageNum - 1,
                    i = this.pdfPageSource.pages.length; if (this.active = !0, this.dirtyMatch) { this.dirtyMatch = !1, this.selected.pageIdx = this.selected.matchIdx = -1, this.offset.pageIdx = t, this.offset.matchIdx = null, this.hadMatch = !1, this.resumePageIdx = null, this.pageMatches = []; for (var s = this, n = 0; n < i; n++) this.updatePage(n), n in this.pendingFindMatches || (this.pendingFindMatches[n] = !0, this.extractTextPromises[n].then(function(e) { delete s.pendingFindMatches[e], s.calcFindMatch(e) })) } if ("" === this.state.query) return void this.updateUIState(u.FIND_FOUND); if (!this.resumePageIdx) { var a = this.offset; if (null !== a.matchIdx) { var o = this.pageMatches[a.pageIdx].length; if (!e && a.matchIdx + 1 < o || e && a.matchIdx > 0) return this.hadMatch = !0, a.matchIdx = e ? a.matchIdx - 1 : a.matchIdx + 1, void this.updateMatch(!0);
                        this.advanceOffsetPage(e) }
                    this.nextPageMatch() } }, matchesReady: function(e) { var t = this.offset,
                    i = e.length,
                    s = this.state.findPrevious; return i ? (this.hadMatch = !0, t.matchIdx = s ? i - 1 : 0, this.updateMatch(!0), !0) : (this.advanceOffsetPage(s), !(!t.wrapped || (t.matchIdx = null, this.hadMatch)) && (this.updateMatch(!1), !0)) }, nextPageMatch: function() { null !== this.resumePageIdx && console.error("There can only be one pending page.");
                do { var e = this.offset.pageIdx,
                        t = this.pageMatches[e]; if (!t) { this.resumePageIdx = e; break } } while (!this.matchesReady(t)) }, advanceOffsetPage: function(e) { var t = this.offset,
                    i = this.extractTextPromises.length; if (t.pageIdx = e ? t.pageIdx - 1 : t.pageIdx + 1, t.matchIdx = null, t.pageIdx >= i || t.pageIdx < 0) return t.pageIdx = e ? i - 1 : 0, void(t.wrapped = !0) }, updateMatch: function(e) { var t = u.FIND_NOTFOUND,
                    i = this.offset.wrapped; if (this.offset.wrapped = !1, e) { var s = this.selected.pageIdx;
                    this.selected.pageIdx = this.offset.pageIdx, this.selected.matchIdx = this.offset.matchIdx, t = i ? u.FIND_WRAPPED : u.FIND_FOUND, s !== -1 && s !== this.selected.pageIdx && this.updatePage(s) }
                this.updateUIState(t, this.state.findPrevious), this.selected.pageIdx !== -1 && this.updatePage(this.selected.pageIdx, !0) }, updateUIState: function(e, t) { var i = ""; if (e !== u.FIND_FOUND && e !== u.FIND_PENDING) { switch (e) {
                        case u.FIND_FOUND:
                            i = this.pdfPageSource.pdfJsPlugin.wp.msg("search.message.found"); break;
                        case u.FIND_PENDING:
                            i = this.pdfPageSource.pdfJsPlugin.wp.msg("search.message.pending"); break;
                        case u.FIND_NOTFOUND:
                            i = this.pdfPageSource.pdfJsPlugin.wp.msg("search.message.notfound"); break;
                        case u.FIND_WRAPPED:
                            i = t ? this.pdfPageSource.pdfJsPlugin.wp.msg("search.message.wrapped.bottom") : this.pdfPageSource.pdfJsPlugin.wp.msg("search.message.wrapped.top") }
                    Alfresco.util.PopupManager.displayMessage({ text: i }) } } }
})();