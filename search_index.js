const corpus = [{ "url": ".\/", "title": "nixpkgs-update", "text": "nixpkgs-updateThe future is here; let's evenly distribute it!\n\nThe nixpkgs-update mission is to make nixpkgs the most up-to-date repository of software in the world by the most\nridiculous margin possible. Here's how we are doing so far.\n\nIt provides an interactive tool for automating single package updates. Given a package name, old version, and new\nversion, it updates the version, and fetcher hashes, makes a commit, and optionally a pull request. Along the way, it\ndoes checks to make sure the update has a baseline quality.\n\nIt is the code used by the GitHub bot @r-ryantm to automatically update nixpkgs. It uses package repository information\nfrom Repology.org, the GitHub releases API, and PyPI to generate a lists of outdated packages.\n" }
,{ "url": "installation\/", "title": "Installation", "text": "Installation For the Cachix cache to work, your user must be in the trusted-users list or you can use sudo since root is\neffectively trusted. \n\nRun without installing:\n\n$ nix run \\\n  --option extra-substituters 'https:\/\/nixpkgs-update.cachix.org\/' \\\n  --option trusted-public-keys 'nixpkgs-update.cachix.org-1:6y6Z2JdoL3APdu6\/+Iy8eZX2ajf09e4EE9SnxSML1W8=' \\\n  -f https:\/\/github.com\/ryantm\/nixpkgs-update\/archive\/master.tar.gz \\\n  -c nixpkgs-update --help\n\nInstall into your Nix profile:\n\n$ nix-env \\\n  --option extra-substituters 'https:\/\/nixpkgs-update.cachix.org\/' \\\n  --option trusted-public-keys 'nixpkgs-update.cachix.org-1:6y6Z2JdoL3APdu6\/+Iy8eZX2ajf09e4EE9SnxSML1W8=' \\\n  -if https:\/\/github.com\/ryantm\/nixpkgs-update\/archive\/master.tar.gz\n\nDeclaratively with niv:\n\n$ niv add ryantm\/nixpkgs-update\n\nNixOS config with Niv:\n\nlet\n  sources = import .\/nix\/sources.nix;\n  nixpkgs-update = import sources.nixpkgs-update {};\nin\n  environment.systemPackages = [ nixpkgs-update ];\n\nhome-manager config with Niv:\n\nlet\n  sources = import .\/nix\/sources.nix;\n  nixpkgs-update = import sources.nixpkgs-update {};\nin\n  home.packages = [ nixpkgs-update ];\n" }
,{ "url": "interactive-updates\/", "title": "Interactive updates", "text": "Interactive updatesnixpkgs-update supports interactive, single package updates via the update subcommand.\n\nUpdate tutorial\n\n1.  Setup hub and give it your GitHub credentials, so it saves an oauth token. This allows nixpkgs-update to query the\n    GitHub API.\n2.  Go to your local checkout of nixpkgs, and make sure the working directory is clean. Be on a branch you are okay\n    committing to.\n3.  Run it like: nixpkgs-update update \"postman 7.20.0 7.21.2\" which mean update the package \"postman\" from\n    version 7.20.0 to version 7.21.2.\n4.  It will run the updater, and, if the update builds, it will commit the update and output a message you could use for\n    a pull request.\n\nFlags\n\n--cve\n\nadds CVE vulnerability reporting to the PR message. On first invocation with this option, a CVE database is built.\nSubsequent invocations will be much faster.\n\n--nixpkgs-review\n\nruns nixpkgs-review, which tries to build all the packages that depend on the one being updated and adds a report.\n" }
,{ "url": "batch-updates\/", "title": "Batch updates", "text": "Batch updatesnixpkgs-update supports batch updates via the update-list subcommand.\n\nUpdate-List tutorial\n\n1.  Setup hub and give it your GitHub credentials, so it saves an oauth token. This allows nixpkgs-update to query the\n    GitHub API.\n\n2.  Clone this repository and build nixpkgs-update:\n    \n    git clone https:\/\/github.com\/ryantm\/nixpkgs-update && cd nixpkgs-update\n    nix-build\n\n3.  To test your config, try to update a single package, like this:\n    \n    .\/result\/bin\/nixpkgs-update update \"pkg oldVer newVer update-page\"`\n    \n    # Example:\n    .\/result\/bin\/nixpkgs-update update \"tflint 0.15.0 0.15.1 repology.org\"`\n\n    replacing tflint with the attribute name of the package you actually want to update, and the old version and new\n    version accordingly.\n    \n    If this works, you are now setup to hack on nixpkgs-update! If you run it with --pr, it will actually send a pull\n    request, which looks like this: https:\/\/github.com\/NixOS\/nixpkgs\/pull\/82465\n\n4.  If you'd like to send a batch of updates, get a list of outdated packages and place them in a packages-to-update.txt\n    file:\n\n.\/result\/bin\/nixpkgs-update fetch-repology > packages-to-update.txt\n\nThere also exist alternative sources of updates, these include:\n\n  - PyPI, the Python Package Index: nixpkgs-update-pypi-releases\n  - GitHub releases: nixpkgs-update-github-releases\n\n5.  Run the tool in batch mode with update-list:\n\n.\/result\/bin\/nixpkgs-update update-list\n" }
,{ "url": "r-ryantm\/", "title": "r-ryantm", "text": "r-ryantm@r-ryantm, is a bot account that updates Nixpkgs by making PRs that bump a package to the latest version. It\nruns on community-configured infrastructure.\n" }
,{ "url": "details\/", "title": "Details", "text": "DetailsSome of these features only apply to the update-list sub-command or to features only available to the @r-ryantm\nbot.\n\nChecks\n\nA number of checks are performed to help nixpkgs maintainers gauge the likelihood that an update was successful. All the\nbinaries are run with various flags to see if they have a zero exit code and output the new version number. The outpath\ndirectory tree is searched for files containing the new version number. A directory tree and disk usage listing is\nprovided.\n\nSecurity report\n\nInformation from the National Vulnerability Database maintained by NIST is compared against the current and updated\npackage version. The nixpkgs package name is matched with the Common Platform Enumeration vendor, product, edition,\nsoftware edition, and target software fields to find candidate Common Vulnerabilities and Exposures (CVEs). The CVEs are\nfiltered by the matching the current and updated versions with the CVE version ranges.\n\nThe general philosophy of the CVE search is to avoid false negatives, which means we expect to generate many false\npositives. The false positives can be carefully removed by manually created rules implemented in the filter function in\nthe NVDRules module.\n\nIf there are no CVE matches, the report is not shown. The report has three parts: CVEs resolved by this update, CVEs\nintroduced by this update, and CVEs present in both version.\n\nIf you would like to report a problem with the security report, please use the nixpkgs-update GitHub issues.\n\nThe initial development of the security report was made possible by a partnership with Serokell and the NLNet Foundation\nthrough their Next Generation Internet Zero Discovery initiative (NGI0 Discovery). NGI0 Discovery is made possible with\nfinancial support from the European Commission.\n\nRebuild report\n\nThe PRs made by nixpkgs-update say what packages need to be rebuilt if the pull request is merged. This uses the same\nmechanism OfBorg uses to put rebuild labels on PRs. Not limited by labels, it can report the exact number of rebuilds\nand list some of the attrpaths that would need to be rebuilt.\n\nPRs against staging\n\nIf a PR merge would cause more than 100 packages to be rebuilt, the PR is made against staging.\n\nLogs\n\nLogs from r-ryantm's runs are available online. There are a lot of packages nixpkgs-update currently has no hope of\nupdating. Please dredge the logs to find out why your pet package is not receiving updates.\n\nCachix\n\nBy uploading the build outputs to Cachix, nixpkgs-update allows you to test a package with one command.\n" }
,{ "url": "contributing\/", "title": "Contributing", "text": "ContributingIncremental development:\n\nnix-shell --run \"cabal v2-repl\"\n\nRun the tests:\n\nnix-shell --run \"cabal v2-test\"\n\nRun a type checker in the background for quicker type checking feedback:\n\nnix-shell --run \"ghcid\"\n\nRun a type checker for the app code:\n\nnix-shell --run 'ghcid -c \"cabal v2-repl exe:nixpkgs-update\"'\n\nRun a type checker for the test code:\n\nnix-shell --run 'ghcid -c \"cabal v2-repl tests\"'\n\nUpdating the Cabal file when adding new dependencies or options:\n\nnix run nixpkgs.haskellPackages.hpack -c hpack\n\nSource files are formatted with Ormolu.\n\nThere is also a Cachix cache available for the dependencies of this program.\n" }
,{ "url": "donate\/", "title": "Donate", "text": "Donate@r-ryantm, the bot that updates Nixpkgs, is currently running on a Hetzner bare-metal server that costs me €60 per\nmonth. Your support in paying for infrastructure would be a great help:\n\n  - GitHub Sponsors\n  - Patreon\n" }
,{ "url": "nixpkgs-maintainer-faq\/", "title": "Nixpkgs Maintainer FAQ", "text": "Nixpkgs Maintainer FAQ@r-ryantm opened a PR for my package, what do I do?\n\nThanks for being a maintainer. Hopefully, @r-ryantm will be able to save you some time!\n\n1.  Review the PR diff, making sure this update makes sense\n      - sometimes updates go backward or accidentally use a dev version\n2.  Review upstream changelogs and commits\n3.  Follow the \"Instructions to test this update\" section of the PR to get the built program on your computer quickly\n4.  Make a GitHub Review approving or requesting changes. Include screenshots or other notes as appropriate.\n\nWhy is @r-ryantm not updating my package?There are lots of reasons a package might not be updated. You can usually\nfigure out which one is the issue by looking at the logs or by asking @ryantm on Matrix or GitHub.\n\nNo new version information\n\nr-ryantm gets its new version information from three sources:\n\n  - Repology - information from Repology is delayed because it only updates when there is an unstable channel release\n  - GitHub releases\n  - PyPi releases\n\nIf none of these sources says the package is out of date, it will not attempt to update it.\n\nSkiplist\n\nWe maintain a Skiplist of different things not to update. It is possible your package is triggering one of the skip\ncriteria.\n\nPython updates are skipped if they cause more than 25 rebuilds.\n\nExisting Open or Draft PR\n\nIf there is an existing PR with the exact title of $attrPath: $oldVersion -> $newVersion, it will not update the\npackage.\n\nVersion not newer\n\nIf Nix's builtins.compareVersions does not think the \"new\" version is newer, it will not update.\n\nIncompatibile with \"Path Pin\"\n\nSome attrpaths have versions appended to the end of them, like ruby_3_0, the new version has to be compatible with this\n\"Path pin\". Here are some examples:\n\n-- >>> versionCompatibleWithPathPin \"libgit2_0_25\" \"0.25.3\"\n-- True\n--\n-- >>> versionCompatibleWithPathPin \"owncloud90\" \"9.0.3\"\n-- True\n--\n-- >>> versionCompatibleWithPathPin \"owncloud-client\" \"2.4.1\"\n-- True\n--\n-- >>> versionCompatibleWithPathPin \"owncloud90\" \"9.1.3\"\n-- False\n--\n-- >>> versionCompatibleWithPathPin \"nodejs-slim-10_x\" \"11.2.0\"\n-- False\n--\n-- >>> versionCompatibleWithPathPin \"nodejs-slim-10_x\" \"10.12.0\"\n-- True\n\nCan't find derivation file\n\nIf nix edit $attrpath does not open the correct file that contains the version string and fetcher hash, the update will\nfail.\n\nUpdate already merged\n\nIf the update is already on master, staging, or staging-next, the update will fail.\n\nCan't find hash or source url\n\nIf the derivation file has no hash or source URL, it will fail.\n\nNo updateScript and no version\n\nIf the derivation file has no version and no updateScript, it will fail.\n\nNo changes\n\nIf the derivation \"Rewriters\" fail to change the derivation, it will fail.\n\nIf there is no updateScript, and the source url or the hash did not change, it will fail.\n\nNo rebuilds\n\nIf the rewrites didn't cause any derivations to change, it will fail.\n\nDidn't build\n\nIf after the rewrites, it doesn't build, it will fail.\n" }
]