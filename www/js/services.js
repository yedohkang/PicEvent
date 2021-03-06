angular.module('app.services', [])

.factory('BlankFactory', [function() {

}])

.factory('Camera', function($q) {

	return {
		getPicture: function(options) {
			var q = $q.defer();

			navigator.camera.getPicture(function(result) {
				q.resolve(result);
			}, function(err) {
				q.reject(err);
			}, options);

			return q.promise;
		}
	}

})

.service('ParsedText', [function() {
	var PageText = "";
	return {
		getPageText: function() {
			return PageText;
		},
		setPageText: function(value) {
			PageText = value;
		}
	}


}])

.service('OCR', ['$q', function($q) {
	return {

		dataURItoBlob: function(dataURI) {
			// convert base64/URLEncoded data component to raw binary data held in a string
			var byteString;
			if (dataURI.split(',')[0].indexOf('base64') >= 0)
				byteString = atob(dataURI.split(',')[1]);
			else
				byteString = unescape(dataURI.split(',')[1]);
			console.log(dataURI);
			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ia], {
				type: mimeString
			});
		},

		datatoBlob: function(byteString) {
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ia], {
				type: "image/jpeg"
			});
		},

		parseImage: function(image, ParsedText) {
			//Prepare form data
			var formData = new FormData();
			formData.append("file", image, "image.jpg");

			//formData.append("url", "http://99quote.com/wp-content/uploads/2016/07/Friday-Quote-11.jpg");
			formData.append("language", "eng");
			formData.append("apikey", "55c862324488957");

			formData.append("isOverlayRequired", true);

			return $q(function(resolve, reject) {

				//Send OCR Parsing request asynchronously
				jQuery.ajax({

					url: "https://api.ocr.space/parse/image",
					data: formData,
					dataType: 'json',
					cache: false,
					contentType: false,
					processData: false,
					type: 'POST',
					success: function(ocrParsedResult) {
						//Get the parsed results, exit code and error message and details
						var parsedResults = ocrParsedResult["ParsedResults"];
						var ocrExitCode = ocrParsedResult["OCRExitCode"];
						var isErroredOnProcessing = ocrParsedResult["IsErroredOnProcessing"];
						var errorMessage = ocrParsedResult["ErrorMessage"];
						var errorDetails = ocrParsedResult["ErrorDetails"];

						var processingTimeInMilliseconds = ocrParsedResult["ProcessingTimeInMilliseconds"];

						//If we have got parsed results, then loop over the results to do something
						if (parsedResults != null) {
							//Loop through the parsed results
							$.each(parsedResults, function(index, value) {
								var exitCode = value["FileParseExitCode"];
								var parsedText = value["ParsedText"];
								var errorMessage = value["ParsedTextFileName"];
								var errorDetails = value["ErrorDetails"];

								var textOverlay = value["TextOverlay"];

								var pageText = '';
								switch (+exitCode) {
									case 1:
										pageText = parsedText;
										break;
									case 0:
									case -10:
									case -20:
									case -30:
									case -99:
									default:
										pageText += "Error: " + errorMessage;
										break;
								}
										console.log(pageText);
								resolve(pageText);
								//ParsedText.setPageText(pageText);
								//return pageText;
							});
						}
					}
				});

			});
		}
	}

}]);
