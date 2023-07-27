SearchBasedNavigationDisplayJS.doSearchFilter = (data, selected) => {
    cursor_wait()
    var pageNumber = 1
    var thePageSize = $('#be-sortselector').data('pagesize')
    var theOrderBy = $('#be-sortselector').find(":selected").val()
    var inputMinPrice = $('input[name="minPrice"]')
    var inputMaxPrice = $('input[name="maxPrice"]')
    var minPrice = inputMinPrice ? inputMinPrice.val().replace(/[^\d.-]/g, '') : 0
    var maxPrice = inputMaxPrice ? inputMaxPrice.val().replace(/[^\d.-]/g, '') : 1e6
    console.warn({datatype: typeof data})
    if (typeof data === typeof []) {
            var facetArray = []
            for (let index = 0 index < data.length index++) {
                var f = data[index]
                SearchBasedNavigationDisplayJS.getEnabledProductFacets(f, true)
            }
    } else {
        var facetArray = SearchBasedNavigationDisplayJS.getEnabledProductFacets(data, selected)
    }
    console.warn({facetArray})
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
    })
    SearchBasedNavigationDisplayJS.refreshBloomreachPageView()
}