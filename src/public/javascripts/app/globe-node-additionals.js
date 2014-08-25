(function () {
    /* global jsSHA, $ */
    var Util = {
            is40CharHex: function (string) {
                var hex40CharRegex = /^[a-f0-9]{40}/i;
                return string.match(hex40CharRegex) !== null;
            },
            hashFingerprint: function (fp) {
                /* eslint new-cap: 0 */
                var fingerBin = new jsSHA(fp, 'HEX');
                return fingerBin.getHash('SHA-1', 'HEX').toUpperCase();
            }
        },
        $searchForm = $('#search-compass-form'),
        $searchInput = $('#main-search'),
        $wasHashed = $('#was-hashed');

    $searchForm.on('submit', function (e) {
        var searchVal = $searchInput.val().trim();

        // check if $wasHashed is false
        if ($wasHashed.val().length === 0 || $wasHashed.val() === 'false') {
            if (Util.is40CharHex(searchVal)) {
                e.preventDefault();
                // is a fingerprint like string
                $searchInput.val(Util.hashFingerprint(searchVal));
                $wasHashed.val('true');

                // submit the form again (this will skip the hash block and submit the form)
                $searchForm.trigger('submit');
            }
        }
    });
}());
