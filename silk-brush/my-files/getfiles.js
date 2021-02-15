window.onload = () => {
    let openReq = indexedDB.open("/idbfs").onsuccess = function (event) {
        let db = event.target.result;
        let objectStore = db.transaction("FILE_DATA").objectStore("FILE_DATA").openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                console.log(cursor.key);
                let extension = cursor.key.split(".").pop();

                if (extension.length > 4) {
                    cursor.continue(); // Not a valid extension, keep going
                }
                else {
                    var file = cursor.value.contents.buffer;

                    // Get window.URL object
                    var URL = window.URL || window.webkitURL;

                    // Create an <a> element
                    var a = document.createElement("a");
                    a.innerHTML = cursor.key;

                    // Set the HREF to a Blob representation of the data to be downloaded
                    // Then add to appropriate <div>
                    switch (extension) {
                        case "tilt":
                            a.href = URL.createObjectURL(new Blob([file], { type: "application/octet-stream" }));
                            document.getElementById("sketch").appendChild(a);
                            break;
                        case "glb":
                            a.href = URL.createObjectURL(new Blob([file], { type: "model/gltf-binary" }));
                            document.getElementById("model").appendChild(a);
                            break;
                        case "png":
                            a.href = URL.createObjectURL(new Blob([file], { type: "image/png" }));
                            document.getElementById("snapshot").appendChild(a);
                            break;
                        default:
                            break;
                    }

                    // Use download attribute to set set desired file name
                    a.setAttribute("download", filename);

                    cursor.continue();
                }
            }
            else {
                console.log("Cursor has reached end of object store");
            }
        };
    };
}