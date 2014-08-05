(function(){
    /* global jsSHA, $ */
    var Util = {
            is40CharHex: function(string) {
                var hex40CharRegex = /^[a-f0-9]{40}/i;
                return string.match(hex40CharRegex) !== null;
            },
            hashFingerprint: function(fp) {
                /* eslint new-cap: 0 */
                var fingerBin = new jsSHA(fp, 'HEX');
                return fingerBin.getHash('SHA-1', 'HEX').toUpperCase();
            }
        },

        hashedSearchPath = '/search2',
        $searchForm = $('#search-form'),
        $searchInput = $('#main-search');

    $searchForm.on('submit', function(e){
        if ($searchForm.attr('action') !== hashedSearchPath) {
            e.preventDefault();

            var searchVal = $searchInput.val().trim();
            if (Util.is40CharHex(searchVal)){
                // is a fingerprint like string
                $searchInput.val(Util.hashFingerprint(searchVal));
            }
            // change form action path
            $searchForm.attr('action', hashedSearchPath);

            // submit the form again
            $searchForm.trigger('submit');
        }
    });
}());
