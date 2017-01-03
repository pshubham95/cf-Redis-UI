var navbarData = [
				{
					"path":"/dashboard",
					"icon":"fa-database",
					"label":"{{dbName}}",
					"href":"/dashboard",
					"id":"dashboard",
					"selected":"true"
				},
				{
					"path":"/executeCommand",
					"icon":"fa-terminal",
					"label":"Redis Terminal",
					"href":"/executeCommand",
					"id":"executeCommand"
				},
				{
					"path":"/logout",
					"icon":"fa-sign-out",
					"label":"Logout",
					"href":"/logout",
					"class":""
				}

			];

module.exports.navbarData = navbarData;