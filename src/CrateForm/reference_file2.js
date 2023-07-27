(function waitForWC() {
    if (typeof wc !== "undefined") {
        dojo.require("wc.render.common");
        dojo.require("wc.widget.RefreshArea");
        dojo.require("dojo.parser");
        wc.render.declareContext('productListNavigation_context', {
            currentPage: '',
            pageSize: '',
            orderBy: '',
            callType: '',
            resultType: ''
        }, '');
        wc.render.declareRefreshController({
            id: "productListNavigation_controller",
            renderContext: wc.render.getContextById("productListNavigation_context"),
            url: "",
            formId: "",
            message: "",
            renderContextChangedHandler: function(message, widget) {
                console.log("ProductListNavigationDisplay.js - renderContextChangedHandler");
                console.log("ProductListNavigationDisplay.js - message::" + JSON.stringify(message));
                this.message = message;
                var controller = this;
                var renderContext = this.renderContext;
                var resultType = renderContext.properties["resultType"];
                if (resultType == "products" || resultType == "both") {
                    widget.refresh(renderContext.properties);
                } else {
                    resultType == ""
                }
            },
            postRefreshHandler: function(widget) {
                console.log("ProductListNavigationDisplay.js - postRefreshHandler");
                cursor_clear();
                var renderContext = widget.controller.renderContext;
                var callType = renderContext.properties["callType"];
                var isPageRefresh = this.message.isPageRefresh
                if (this.message.currentPage) {
                    jsRefreshCategoriesDisplay.currentPage = this.message.currentPage;
                }
                if (this.message.pageSize) {
                    jsRefreshCategoriesDisplay.pageSize = this.message.pageSize;
                }
                if (this.message.orderBy) {
                    jsRefreshCategoriesDisplay.orderBy = this.message.orderBy;
                }
                var overlayActive = $('.side-nav-container__overlay').hasClass('active');
                SearchBasedNavigationDisplayJS.updateFacetSection(10);
                if (overlayActive) {
                    $('.side-nav-container__overlay').addClass('active');
                }
                if (!isPageRefresh) {
                    var baLevel0 = buildThisAccordion('[data-module="side_nav_level0"]', '.side-nav-level0', 1);
                    var baLevel1 = buildThisAccordion('[data-module="side_nav_level1"]', '.side-nav-level1', 1);
                }
                var refreshScript = jQuery("#ProductListNavigationPostAjaxJavascript>script");
                if (refreshScript) {
                    for (var i = 0; i < refreshScript.length; i++) {
                        eval(refreshScript[i].text);
                    }
                }
                refreshScript = jQuery("#facetRefreshScript>script");
                if (refreshScript) {
                    eval(refreshScript.text());
                }
                if (!isPageRefresh) {
                    buildThisInputSelect('[data-module="input_select"]', '.input-select');
                }
                if ($(".side-nav-container__block")) {
                    $(".side-nav-container__block").addClass("active");
                }
                ui.scrollTo('.flex-container')
                if (callType == "doSearch" || callType == "doSearchFromChip") {
                    if ($('.range-slider').length > 0) {
                        var productSliderMutation = detectMutation('.range-slider', [SearchBasedNavigationDisplayJS.adjustPriceRange, SearchBasedNavigationDisplayJS.enableClearFacets, range[0].refreshSlider(), SearchBasedNavigationDisplayJS.findSelectedFacets]);
                    }
                    SearchBasedNavigationDisplayJS.enableClearFacets();
                    if (callType == "doSearchFromChip") {
                        SearchBasedNavigationDisplayJS.resetLeftTick(renderContext);
                    }
                } else {
                    if (callType == "clearSearch") {
                        SearchBasedNavigationDisplayJS.clearEnabledProductFacets();
                        var sliderMaxPrice = jsRefreshCategoriesDisplay.maintainMaxPrice;
                        if (sliderMaxPrice == "") {
                            sliderMaxPrice = SearchBasedNavigationDisplayJS.facetFixedMinPrice;
                        }
                        var dWidth = rangeSliderIndex[0].dragNodeWidth;
                        rangeSliderIndex[0].dragNodeValues[0].value = 0;
                        rangeSliderIndex[0].dragNodeValues[0].pos = 0;
                        rangeSliderIndex[0].dragNodeValues[0].percent = 0;
                        rangeSliderIndex[0].dragNodeValues[1].value = sliderMaxPrice;
                        rangeSliderIndex[0].dragNodeValues[1].pos = dWidth;
                        rangeSliderIndex[0].dragNodeValues[1].percent = 0;
                    }
                }
                updateBrowserURL();
                eval($('#facetIdsScript>script').text());
                $('.side-nav-level0[style]').removeAttr("style");
                $('.side-nav-level2__header[style]').removeAttr("style");
                ui.rangeSlider();
                ui.showFilterSelection();
                ui.truncate('.side-nav-level2__header-label', 14, 0);
                updateFacetURL(callType);
                $(function() {
                    $('.product-tile-basket__stepper-up').unbind('click').click(function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var partnumber;
                        if (typeof ($(this).data) != "undefined") {
                            partnumber = $(this).data("stepuppartnumber");
                        }
                        var target = $(this).parent().find(".-js-tile-stepper");
                        if (typeof (partnumber) == "undefined") {
                            partnumber = target.data().id;
                        }
                        var skuData;
                        if (typeof (mapProductDetails) != "undefined") {
                            skuData = mapProductDetails[partnumber];
                        }
                        if (typeof (skuData) == "undefined") {
                            skuData = QuickViewJS.skuDataFromRR(partnumber, 1);
                        }
                        if (typeof (skuData) == "undefined") {
                            skuData = OrderItemUpdateJS.skuDataFromTile(partnumber);
                        }
                        var display = $(this).parent().find(".product-tile-basket__stepper-display");
                        var fromMobile = $(this).data("stepupinmobile");
                        if (fromMobile) {
                            OrderItemUpdateJS.addSkuToBasketFromMob(skuData, true);
                        } else {
                            OrderItemUpdateJS.addSkuToBasket(skuData, true);
                        }
                    });
                    $('.product-tile-basket__stepper-down').unbind('click').click(function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var partnumber;
                        if (typeof ($(this).data) != "undefined") {
                            partnumber = $(this).data("stepdownpartnumber");
                        }
                        var target = $(this).parent().find(".-js-tile-stepper");
                        var display = $(this).parent().find(".product-tile-basket__stepper-display");
                        if (typeof (partnumber) == "undefined") {
                            partnumber = target.data().id;
                        }
                        var skuData;
                        if (typeof (mapProductDetails) != "undefined") {
                            skuData = mapProductDetails[partnumber];
                        }
                        if (typeof (skuData) == "undefined") {
                            skuData = QuickViewJS.skuDataFromRR(partnumber, 1);
                        }
                        if (typeof (skuData) == "undefined") {
                            skuData = OrderItemUpdateJS.skuDataFromTile(partnumber);
                        }
                        OrderItemUpdateJS.removeSkuFromBasket(skuData);
                    });
                    OrderItemUpdateJS.orderItemListPartnumbers = [];
                    OrderItemUpdateJS.initRichA2bCounts();
                    OrderItemUpdateJS.initListA2bCounts();
                    OrderItemUpdateJS.resetNoneBasketTiles();
                });
                if (document.getElementById("delivery_prices_std")) {
                    document.getElementById("delivery_prices_std").setAttribute("hidden", true);
                }
                if (document.getElementById("delivery_prices_spl")) {
                    document.getElementById("delivery_prices_spl").setAttribute("hidden", true);
                }
                if (document.getElementById("delivery_prices_subs")) {
                    document.getElementById("delivery_prices_subs").setAttribute("hidden", true);
                }
            }
        });
    } else {
        setTimeout(waitForWC, 100);
    }
}
)();
function getPageNumber() {
    var pageSize = 24;
    $('.results-view-selector__item').each(function(index) {
        if ($(this).hasClass('active')) {
            pageSize = $(this).find('span').text();
            return pageSize;
        }
    });
    return pageSize;
}
if (typeof (SearchBasedNavigationDisplayJS) == "undefined" || SearchBasedNavigationDisplayJS == null || !SearchBasedNavigationDisplayJS) {
    SearchBasedNavigationDisplayJS = {
        facetIdsArray: new Array,
        facetIdValueString: '',
        facetFixedMinPrice: '',
        facetFixedMaxPrice: '',
        searchProductCount: '',
        clearFacetButtonClass: '',
        dragNodeValues: [{
            "value": 0,
            "pos": 0,
            "percent": 0
        }, {
            "value": 0,
            "pos": 0,
            "percent": 0
        }],
        adjustedDragNodeValues: [{
            "value": 0,
            "pos": 0,
            "percent": 0
        }, {
            "value": 0,
            "pos": 0,
            "percent": 0
        }],
        init: function(searchResultUrl) {
            wc.render.getRefreshControllerById('productListNavigation_controller').url = searchResultUrl;
        },
        clearEnabledProductFacets: function() {
            var facetForm = document.forms['productsFacets'];
            var elementArray = facetForm.elements;
            for (var i = 0; i < elementArray.length; i++) {
                var element = elementArray[i];
                if (element.type != null && (element.type.toUpperCase() == "CHECKBOX" || element.type.toUpperCase() == "RADIO")) {
                    $(element).removeAttr('checked');
                    $('.side-nav-level2__box').removeClass('active');
                    $('.side-nav-level2__header-label').removeClass('active');
                }
            }
        },
        updateFacetSection: function(updateCounter) {
            var facetAjaxContent = $("#facetSectionAjax").html();
            if (facetAjaxContent.trim().length > 0) {
                $("#facetSection").html($("#facetSectionAjax").html());
                $("#facetSectionAjax").html('');
            } else if (updateCounter-- > 0) {
                setTimeout(SearchBasedNavigationDisplayJS.updateFacetSection(updateCounter), 100);
            }
        },
        setCheckedFilterFacetForDecodedValue: function(value) {
            var valueSplit = value.split(":");
            $('input:checkbox.checker').each(function() {
                if (valueSplit.length > 1 && valueSplit[1].indexOf("%25") == 0) {
                    valueSplit[1] = valueSplit[1].replace(/%25/g, "%");
                }
                if (this.value.indexOf(valueSplit[0]) == 0 && this.value.indexOf(valueSplit[1]) > 0) {
                    $(this).trigger("click");
                }
            });
        },
        pushFacets: function(elementArray, facetArray, data, selected) {
            for (var i = 0; i < elementArray.length; i++) {
                var element = elementArray[i];
                if (element.type != null && (element.type.toUpperCase() == "CHECKBOX" || element.type.toUpperCase() == "RADIO")) {
                    element.disabled = true;
                    var facetId = $(element).val();
                    var tick_box = $(element).parent().find('.side-nav-level2__box');
                    var ticked = tick_box.hasClass('active');
                    if (facetId == data | ticked) {
                        if (facetId == data && !selected && $.inArray(element.value, facetArray) == -1) {
                            facetArray.push(element.value);
                        } else if (facetId != data && ticked && $.inArray(element.value, facetArray) == -1) {
                            facetArray.push(element.value);
                        }
                    }
                }
            }
        },
        facetSelected: function(element) {
            var tick_box = $(element).parent().find('.side-nav-level2__box');
            var ticked = tick_box.hasClass('active');
            return ticked;
        },
        getEnabledProductFacets: function(data, selected) {
            var facetForm = document.forms['productsFacets'];
            var elementArrayCheckbox = document.querySelectorAll('input[type=checkbox]');
            var elementArrayRadio = document.querySelectorAll('input[type=radio]');
            var facetArray = new Array();
            this.pushFacets(elementArrayCheckbox, facetArray, data, selected);
            this.pushFacets(elementArrayRadio, facetArray, data, selected);
            if (intGetId("price_range_go") != null) {
                intGetId("price_range_go").disabled = true;
            }
            return facetArray;
        },
        doFacetSearch: function(event) {
            if (this.checked) {
                this.setAttribute("checked", "checked");
            } else {
                this.removeAttribute("checked");
            }
            this.doSearchFilter();
        },
        doSearchFilterFromChip: function(data, selected) {
            if (!submitRequest()) {
                console.log("ProductListNavigationDisplay.js - SearchBasedNavigationDisplayJS - showResultsPage : WAITING");
                return;
            }
            cursor_wait();
            var pageNumber = 1;
            var thePageSize = $('#be-sortselector').data('pagesize');
            var theOrderBy = $('#be-sortselector').find(":selected").val();
            var inputMinPrice = $('input[name="minPrice"]');
            var inputMaxPrice = $('input[name="maxPrice"]');
            var minPrice = inputMinPrice ? inputMinPrice.val().replace(/[^\d.-]/g, '') : 0;
            var maxPrice = inputMaxPrice ? inputMaxPrice.val().replace(/[^\d.-]/g, '') : 1e6;
            var facetArray = this.getEnabledProductFacets(data, selected);
            wc.render.updateContext('productListNavigation_context', {
                currentPage: pageNumber,
                pageSize: thePageSize,
                minPrice: minPrice,
                maxPrice: maxPrice,
                maintainMaxPrice: $("input[name^='maintainMaxPrice']").val(),
                orderBy: theOrderBy,
                facet: facetArray,
                data: data,
                callType: "doSearchFromChip",
                resultType: "products"
            });
            this.refreshBloomreachPageView();
        },
        doSearchFilter: function(data, selected) {
            if (!submitRequest()) {
                console.log("ProductListNavigationDisplay.js - SearchBasedNavigationDisplayJS - showResultsPage : WAITING");
                return;
            }
            cursor_wait();
            var pageNumber = 1;
            var thePageSize = $('#be-sortselector').data('pagesize');
            var theOrderBy = $('#be-sortselector').find(":selected").val();
            var inputMinPrice = $('input[name="minPrice"]');
            var inputMaxPrice = $('input[name="maxPrice"]');
            var minPrice = inputMinPrice ? inputMinPrice.val().replace(/[^\d.-]/g, '') : 0;
            var maxPrice = inputMaxPrice ? inputMaxPrice.val().replace(/[^\d.-]/g, '') : 1e6;
            var facetArray = this.getEnabledProductFacets(data, selected);
            wc.render.updateContext('productListNavigation_context', {
                currentPage: pageNumber,
                pageSize: thePageSize,
                minPrice: minPrice,
                maxPrice: maxPrice,
                maintainMaxPrice: $("input[name^='maintainMaxPrice']").val(),
                orderBy: theOrderBy,
                facet: facetArray,
                callType: "doSearch",
                resultType: "products"
            });
            this.refreshBloomreachPageView();
        },
        resetLeftTick: function(context) {
            var facetForm = document.forms['productsFacets'];
            var elementArray = facetForm.elements;
            var data = context.properties["data"];
            var facetArray = new Array();
            for (var i = 0; i < elementArray.length; i++) {
                var element = elementArray[i];
                if (element.type != null && (element.type.toUpperCase() == "CHECKBOX" || element.type.toUpperCase() == "RADIO")) {
                    var facetId = $(element).val();
                    if (facetId == data) {
                        $(element).removeAttr('checked');
                        var tick_box = $(element).parent().find('.side-nav-level2__box');
                        var tick_box_header = $(element).parent().find('.side-nav-level2__header-label');
                        tick_box.removeClass('active');
                        tick_box_header.removeClass('active');
                    }
                }
            }
        },
        checkLeftTick: function(currentFacetIds, currentFacetQty, currentMax) {
            var facetForm = document.forms['productsFacets'];
            var elementArray = facetForm.elements;
            var disableFacet = new Array();
            var enableFacet = new Array();
            var emptyFacets = new Array();
            var tick_box_header = '';
            var tick_box_active = '';
            var found = false;
            for (var i = 0; i < elementArray.length; i++) {
                var element = elementArray[i];
                if (element.type != null && (element.type.toUpperCase() == "CHECKBOX" || element.type.toUpperCase() == "RADIO")) {
                    var name = $(element).attr('name');
                    var facetId = name.substring(2);
                    var isChecked = $(element).attr('checked');
                    tick_box_header = $(element).parent().closest('.side-nav-level0').attr('id');
                    tick_box_active = $(element).parent().find('.side-nav-level2__header-label').hasClass('active');
                    found = $.inArray(facetId, currentFacetIds);
                    if (emptyFacets === undefined) {
                        emptyFacets = new Array();
                    }
                    if (found >= 0 || tick_box_active) {
                        emptyFacets.push(tick_box_header);
                        enableFacet.push(facetId);
                    } else {
                        disableFacet.push(facetId);
                    }
                }
            }
            for (var i = 0; i < disableFacet.length; i++) {
                facetIdNum = disableFacet[i];
                var quantity = currentFacetQty[facetIdNum];
                var element = $("input[name=p1" + facetIdNum + "]");
                var tick_box_header = $(element).parent().find('.side-nav-level2__header');
                tick_box_header.hide();
            }
            for (var i = 0; i < enableFacet.length; i++) {
                facetIdNum = enableFacet[i];
                var quantity = currentFacetQty[facetIdNum];
                if (quantity === undefined) {
                    quantity = currentMax;
                }
                var element = $("input[name=p1" + facetIdNum + "]");
                var tick_box_header = $(element).parent().find('.side-nav-level2__header');
                var qtyText = $(tick_box_header).find('li.side-nav-level2__quantity');
                qtyText.html(quantity);
                tick_box_header.show();
            }
            var facetSections = $('section .side-nav-level0');
            for (var facetsId = 0; facetsId < facetSections.length; facetsId++) {
                var id = $(facetSections[facetsId]).attr('id');
                var hasFacets = $.inArray(id, emptyFacets);
                if (hasFacets >= 0 || id == 'facetIdPriceSlider') {
                    $(facetSections[facetsId]).show();
                } else {
                    $(facetSections[facetsId]).hide();
                }
            }
        },
        clearSearchFilter: function() {
            if (!SearchBasedNavigationDisplayJS.getFacetsSelected()) {
                console.log("ProductListNavigationDisplay.js - No facets selected");
                return;
            }
            if (!submitRequest()) {
                console.log("ProductListNavigationDisplay.js - SearchBasedNavigationDisplayJS - showResultsPage : WAITING");
                return;
            }
            cursor_wait();
            var pageNumber = 1;
            var thePageSize = $('#be-sortselector').data('pagesize');
            var theOrderBy = $('#be-sortselector').find(":selected").val();
            var inputMinPrice = $('input[name="minPrice"]');
            var inputMaxPrice = $("input[name^='maintainMaxPrice']");
            var minPrice = 0;
            var maxPrice = 1e6;
            var facetArray = new Array();
            WCParamJS.facet = facetArray;
            wc.render.updateContext('productListNavigation_context', {
                currentPage: pageNumber,
                pageSize: thePageSize,
                minPrice: minPrice,
                maxPrice: 1e6,
                orderBy: theOrderBy,
                facet: facetArray,
                callType: "clearSearch",
                resultType: "products"
            });
            this.refreshBloomreachPageView();
        },
        removeParameterFromUrlfunction: function(url, parameter) {
            var urlparts = url.split('?');
            if (urlparts.length >= 2) {
                var prefix = parameter + '=';
                var pars = urlparts[1].split(/[&;]/g);
                for (var i = pars.length; i-- > 0; ) {
                    if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                        pars.splice(i, 1);
                    }
                }
                url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
                return url;
            } else {
                return url;
            }
        },
        getFacetsSelected: function() {
            var facetSelected = false;
            var facetSelected = $('[data-module="side_nav_container"]').find(".side-nav-level2__box").hasClass('active');
            if (!facetSelected && $('[data-module="side_nav_container"]').find("input.-js-dot-value-1").val()) {
                facetSelected = SearchBasedNavigationDisplayJS.hasPriceChanged();
            }
            return facetSelected;
        },
        hasPriceChanged: function() {
            var ckMaxPriceDefault = $("input[name^='maintainMaxPrice']").val();
            var ckMinPriceDefault = 0;
            var ckMaxSliderPrice = rangeSliderIndex[0].dragNodeValues[1].value;
            var ckMinSliderPrice = rangeSliderIndex[0].dragNodeValues[0].value;
            return false && (ckMaxPriceDefault != ckMaxSliderPrice || ckMinPriceDefault != ckMinSliderPrice);
        },
        enableClearFacets: function() {
            if (SearchBasedNavigationDisplayJS.getFacetsSelected()) {
                $('#clearFacetBtn').removeClass('inactive');
                $('#clearFacetBtn').removeClass('disabled');
            } else {
                $('#clearFacetBtn').addClass('inactive');
                $('#clearFacetBtn').addClass('disabled');
            }
            if ($(".-js-range-slider-0") && $(".-js-range-slider-0").data()) {
                $(".-js-range-slider-0").data().data.max = "" + $("input[name^='maintainMaxPrice']").val();
            }
        },
        findSelectedFacets: function() {
            if (SearchBasedNavigationDisplayJS.getFacetsSelected()) {
                var facetsSelected = $('[data-module="side_nav_container"]').find("input:checkbox:checked");
                if (facetsSelected.length > 0) {
                    var val = facetsSelected[0];
                    var sectionN = $(val).closest("section");
                    var id = sectionN.attr('id');
                } else {}
            }
        },
        setPriceRange: function() {
            var sliderMinPrice = $("#inputMinPrice").val().replace(/[^\d.-]/g, '');
            if (rangeSliderIndex) {
                SearchBasedNavigationDisplayJS.dragNodeValues[0].value = rangeSliderIndex[0].dragNodeValues[0].value;
                SearchBasedNavigationDisplayJS.dragNodeValues[0].pos = rangeSliderIndex[0].dragNodeValues[0].pos;
                SearchBasedNavigationDisplayJS.dragNodeValues[0].percent = rangeSliderIndex[0].dragNodeValues[0].percent;
                SearchBasedNavigationDisplayJS.dragNodeValues[1].value = rangeSliderIndex[0].dragNodeValues[1].value;
                SearchBasedNavigationDisplayJS.dragNodeValues[1].pos = rangeSliderIndex[0].dragNodeValues[1].pos;
                SearchBasedNavigationDisplayJS.dragNodeValues[1].percent = rangeSliderIndex[0].dragNodeValues[1].percent;
            }
        },
        adjustPriceRange: function() {
            var sliderMinPrice = $("#inputMinPrice").val().replace(/[^\d.-]/g, '');
            var sliderMaxPrice = $("#inputMaxPrice").val().replace(/[^\d.-]/g, '');
            if (rangeSliderIndex[0].dragNodeValues[0].value == 0) {
                sliderMinPos = 0;
                sliderMinPercent = 0;
            } else {
                sliderMinPos = sliderMinPrice * rangeSliderIndex[0].dragNodeValues[0].pos / rangeSliderIndex[0].dragNodeValues[0].value;
                sliderMinPercent = sliderMinPrice * rangeSliderIndex[0].dragNodeValues[0].percent / rangeSliderIndex[0].dragNodeValues[0].value;
            }
            if (rangeSliderIndex[0].dragNodeValues[1].value == 0) {
                sliderMaxPos = 0;
                sliderMaxPercent = 0;
            } else {
                sliderMaxPos = sliderMaxPrice * rangeSliderIndex[0].dragNodeValues[1].pos / rangeSliderIndex[0].dragNodeValues[1].value;
                sliderMaxPercent = sliderMaxPrice * rangeSliderIndex[0].dragNodeValues[1].percent / rangeSliderIndex[0].dragNodeValues[1].value;
            }
            rangeSliderIndex[0].dragNodeValues[0].value = sliderMinPrice;
            rangeSliderIndex[0].dragNodeValues[0].pos = sliderMinPos;
            rangeSliderIndex[0].dragNodeValues[0].percent = sliderMinPercent;
            rangeSliderIndex[0].dragNodeValues[1].value = sliderMaxPrice;
            rangeSliderIndex[0].dragNodeValues[1].pos = sliderMaxPos;
            rangeSliderIndex[0].dragNodeValues[1].percent = sliderMaxPercent;
        },
        showResultsPage: function(data) {
            var pageNumber = dojo.number.parse(data['currentPage']) ? dojo.number.parse(data['currentPage']) : 1;
            var thePageSize = dojo.number.parse(data['pageSize']);
            if (isNaN(thePageSize)) {
                thePageSize = getPageNumber();
            }
            var theOrderBy = dojo.number.parse(data['orderBy']) ? dojo.number.parse(data['orderBy']) : 1;
            var thePageRefresh = data['isPageRefresh'];
            var categoryId = '';
            var refreshForm = document.forms["RefreshSearchDisplay"];
            if (refreshForm) {
                categoryId = refreshForm.elements["categoryId"].value;
            }
            if (!submitRequest()) {
                console.log("ProductListNavigationDisplay.js - SearchBasedNavigationDisplayJS - showResultsPage : WAITING");
                return;
            }
            var inputMinPrice = $('input[name="minPrice"]');
            var inputMaxPrice = $('input[name="maxPrice"]');
            var minPrice = inputMinPrice ? inputMinPrice.val().replace(/[^\d.-]/g, '') : 0;
            var maxPrice = inputMaxPrice ? inputMaxPrice.val().replace(/[^\d.-]/g, '') : 1e6;
            var facetArray = this.getEnabledProductFacets(data, false);
            var crumbIds = '';
            var crumbNames = '';
            if (typeof bloomreachCrumbVars !== 'undefined') {
                crumbIds = bloomreachCrumbVars.catCrumbIds;
                crumbNames = bloomreachCrumbVars.catCrumbNames;
            }
            var maintainMaxPrice = $("input[name^='maintainMaxPrice']").val();
            cursor_wait();
            wc.render.updateContext('productListNavigation_context', {
                categoryId: categoryId,
                currentPage: pageNumber,
                pageSize: thePageSize,
                minPrice: minPrice,
                maxPrice: maxPrice,
                maintainMaxPrice: maintainMaxPrice,
                orderBy: theOrderBy,
                facet: facetArray,
                callType: "showResults",
                resultType: "products",
                catCrumbIds: crumbIds,
                catCrumbNames: crumbNames,
                isPageRefresh: thePageRefresh
            });
            this.refreshBloomreachPageView();
        },
        refreshBloomreachPageView: function() {
            if (document.readyState === 'complete') {
                window.dataLayer.push({
                    "event": "pageViewRefreshArea"
                });
            }
        }
    };
}
