$( document ).ready(function() {

    // Récupération des différents tags déclarés, et création des éléments du menu Tags
    let tags = getDeclaredTags('.apps');

    tags.sort(function(a,b) {
        return sansAccent(a) < sansAccent(b) ? -1 : 1;
    });

    let tagElements = '';
    tags.forEach(function(item) {
        tagElements += '<li data-tag="'+ item + '"><a href="#">'+ item + '</a></li>';
    });
    $('.filters.tags ul').append(tagElements);


    /* Filtre CATEGORIES et TAGS */

    $('.filters h3 > a').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.filters').toggleClass('opened');
    });

    const applyFilterCategories = function() {
        $('.app.categories-filter-off').removeClass('categories-filter-off filter-off');

        let selectedElements = $('.filters.categories li.selected a');
        if (selectedElements.length > 0) {
            let selectedCategories = [];
            selectedElements.each(function(index, item) {
                selectedCategories.push( item.attributes.class.value );
            });
            $('.app')
                .filter(function(index) {
                    return selectedCategories.indexOf( $(this).data('category') ) === -1;
                })
                .addClass('categories-filter-off filter-off')
                .find('.app-details').removeClass('opened');
        }
    };

    const applyFilterTags = function() {
        $('.app.tags-filter-off').removeClass('tags-filter-off filter-off');
        let selectedElements = $('.filters.tags li.selected a');
        if (selectedElements.length > 0) {
            let selectedTags = [];
            selectedElements.each(function(index, item) {
                selectedTags.push( item.innerText );
            });
            $('.app')
                .filter(function(index) {
                    let tags = getDeclaredTags($(this));
                    return arraysIntersection(selectedTags, tags).length === 0;
                })
                .addClass('tags-filter-off filter-off')
                .find('.app-details').removeClass('opened');
        }
    };

    const updateAppCount = function() {
        $('.apps').attr('apps-count', $('.app').not('.filter-off').length);
    };

    const applyFilters = function() {

        // Categories
        applyFilterCategories();

        // Tags
        applyFilterTags();

        // Sert à contrecarrer l'affichage de Chrome lorsqu'il n'y a que deux applications
        updateAppCount();
    };

    updateAppCount();

    $('.filters li a').on('click', function(e) {
        e.preventDefault();

        if ($(this).hasClass('tout')) {

            // Cas particulier : Filtre "tout voir"
            $('.filters.categories li').removeClass('selected all-selected');
            $(this).closest('li').toggleClass('all-selected');

        } else if ($(this).closest('.filters').hasClass('categories')) {

            $('.filters.categories li a.tout').closest('li').removeClass('all-selected');

            // Cas particulier des catégories : sélection exclusive
            if (! $(this).closest('li').hasClass('selected')) {
                // Si on ne déselectionne pas la catégorie cliquée, on déselectionne toutes les autres
                $('.filters.categories li').removeClass('selected');
            }
            $(this).closest('li').toggleClass('selected');

            if ($('.filters.categories li.selected').length === 0) {
                $('.filters.categories li a.tout').closest('li').attr('class', 'all-selected');
            }


        } else {
            // Cas général (tags)
            $(this).closest('li').toggleClass('selected');
        }

        applyFilters();
    });

    $('.app-details-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.app-content').find('.app-details').toggleClass('opened');
    });

    $('.app-details-close').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.app-content').find('.app-details').removeClass('opened');
    });


    /* TITRES des applications --> liens (si aucun n'a été créé manuellement) */

    $('.app-header h2').each(function(index, item) {

        const hasAlreareadyALinkChild = $('a', $(this)).length > 0;
        const appLinks = $(this).closest('.app').find('.app-content > .app-links a');
        if (!hasAlreareadyALinkChild && (appLinks.length > 0)) {

            const linkHref = $(appLinks[0]).attr('href');

            var link = $('<a/>');
            link.attr('href', linkHref);

            $(this).contents().wrap(link);

        }
    });

    /* TAGs cliquables */

    $('.app-tags li').each(function(index, item) {
        var link = $('<a href="#" />');
        $(this).contents().wrap(link);
    });

    $('.app-tags li > a').on('click', function(event) {
        event.preventDefault();

        $('.filters.tags').removeClass('opened').addClass('opened');
        $('.filters.tags li').removeClass('selected');
        $('.filters.tags li[data-tag='+ $(this).text() +']').addClass('selected');

        applyFilters();
    });

});

function getDeclaredTags(selector) {
    let tags = [];
    $('.app-tags li', selector).each(function(index, item) {
        const tag = item.innerText;
        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
        }
    });
    return tags;
}

function arraysIntersection(array1, array2) {
    return array1.filter(function(n) {
        return array2.indexOf(n) !== -1;
    });
}

function sansAccent(text) {

    var i, n = text.length-1;
    var result = "";
    var c, lower, isLower;

    for (i=0; i<=n; i++) {

        c = text.charAt(i);
        lower = c.toLowerCase();
        isLower = c === lower;

        if (String("àáâãäå").indexOf(lower)>=0) {
            c = "a";
        } else if (String("èéêë").indexOf(lower)>=0) {
            c = "e";
        } else if (String("ìíïî").indexOf(lower)>=0) {
            c = "i";
        } else if (String("ðòóôõö").indexOf(lower)>=0) {
            c = "o";
        } else if (String("ùúüû").indexOf(lower)>=0) {
            c = "u";
        } else if (String("ýÿ").indexOf(lower)>=0) {
            c = "y";
        } else if (String("ñ").indexOf(lower)>=0) {
            c = "n";
        } else if (String("ç").indexOf(lower)>=0) {
            c = "c";
        } else if (String("ž").indexOf(lower)>=0) {
            c = "z";
        } else if (String("š").indexOf(lower)>=0) {
            c = "s";
        }
        result += isLower ? c : c.toUpperCase();
    }
    return result;
}
