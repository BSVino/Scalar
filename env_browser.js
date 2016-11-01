Scalar.print = function(string) {
	console.log(string);
};

// Blocking file read, only use for local reads!
Scalar.read_file = function(file) {
	let xmlhttp = new XMLHttpRequest();

	let result;

	xmlhttp.onreadystatechange=function()
	{
		Scalar.print(xmlhttp.readyState);

		if (xmlhttp.readyState==4)
		{
			result = xmlhttp.responseText;
		}
	};

	let url = window.location.href;
	url = url.substring(0, url.lastIndexOf("/") + 1) + file;

	xmlhttp.open("GET", url, false);
	xmlhttp.send();

	return result;
}

Scalar.assert = function(condition, message) {
	if (!condition) {
		Scalar.print("Assert failed. Backtrace:");
		Scalar.print(new Error().stack);
		throw message || "Assert failed";
	}
}
