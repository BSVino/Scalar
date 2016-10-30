scalar_print = function(string) {
	console.log(string);
};

// Blocking file read, only use for local reads!
scalar_read_file = function(file) {
	var xmlhttp = new XMLHttpRequest();

	var result;

	xmlhttp.onreadystatechange=function()
	{
		scalar_print(xmlhttp.readyState);

		if (xmlhttp.readyState==4)
		{
			result = xmlhttp.responseText;
		}
	};

	var url = window.location.href;
	url = url.substring(0, url.lastIndexOf("/") + 1) + file;

	xmlhttp.open("GET", url, false);
	xmlhttp.send();

	return result;
}

