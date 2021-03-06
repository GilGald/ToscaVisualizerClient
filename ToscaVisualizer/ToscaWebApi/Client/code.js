$(function () { // on dom ready


    $("#uploadBtn")
        .click(function () {
            $("#loading_img").show();
            var formdata = new FormData();
            var file = $("#uploadfile")[0].files[0];
            formdata.append("Uploaded", file);
            $.ajax({
                url: '../api/Tosca/Upload',
                type: 'POST',
                data: formdata,
                success: function (data) {
                    addElements(createNodes(data), createEdges(data));
                },
                cache: false,
                contentType: false,
                processData: false
            })
            .done(function (result) {
                $("#loading_img").hide();
            });;
        });


    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    // We can watch for our custom `fileselect` event like this
    $(document).ready(function () {
        $(':file').on('fileselect', function (event, numFiles, label) {

            var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;

            if (input.length) {
                input.val(log);
            } else {
                if (log) alert(log);
            }

        });
    });






    var cy = cytoscape({
        container: document.getElementById('cy'),
        boxSelectionEnabled: true,
        autounselectify: false,
        zoom: 3,
        style: [
            {
                selector: ':selected',
                css: {
                    'border-width': 3,
                    'border-color': '#A1A1A1'
                }
            },
          {
              selector: 'node',
              css: {
                  'shape': 'data(faveShape)',
                  'text-valign': 'center',
                  'text-outline-width': 1,
                  'text-outline-color': 'data(faveColor)',
                  'background-color': 'data(faveColor)',
                  'color': '#fff',
                  'font-size': '10px',
                  'content': 'data(id)',
              }
          },
          {
              selector: 'edge',
              css: {
                  'target-arrow-shape': 'triangle',
                  'curve-style': 'bezier',
                  'target-arrow-color': 'data(faveColor)',
                  'line-color': 'data(faveColor)',
                  'width': 'mapData(strength, 1, 0, 2, 6)',
              }
          },

        ]
    });






    function addElements(nodes, edges) {
        cy.add(nodes);

        for (i = 0; i < nodes.length; i++) {
            var id = nodes[i].data.id;
            cy.$('#' + id).qtip({
                content: nodes[i].data.fullname,
                position: {
                    my: 'top center',
                    at: 'top center'
                },
                style: {
                    classes: 'qtip-bootstrap',
                    tip: {
                        width: 8,
                        height: 40
                    }
                }
            });

            cy.on('tap',
                '#' + id,
                { fullname: nodes[i].data.fullname, allData: nodes[i].data.allData },
                function (evt) {

                    CreateProperties(evt.data.allData.Properties);
                    CreateRequirements(evt.data.allData.Requirements);
                    CreateCapabilities(evt.data.allData.Capabilities);
                    CreateAttributes(evt.data.allData.Attributes);
                    CreateArtifacts(evt.data.allData.Artifact);


                });
        }

        cy.add(edges);

        var options = {
            name: 'concentric',

            fit: true, // whether to fit the viewport to the graph
            padding: 4, // the padding on fit
            startAngle: 3 / 2 * Math.PI, // where nodes start in radians
            sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
            clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
            equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
            minNodeSpacing: 1, // min spacing between outside of nodes (used for radius adjustment)
            boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
            height: undefined, // height of layout area (overrides container height)
            width: undefined, // width of layout area (overrides container width)
            concentric: function (node) { // returns numeric value for each node, placing higher nodes in levels towards the centre
                return node.degree();
            },
            levelWidth: function (nodes) { // the variation of concentric values in each level
                return nodes.maxDegree() / 4;
            },
            animate: true, // whether to transition the node positions
            animationDuration: 800, // duration of animation in ms if enabled
            animationEasing: undefined, // easing of animation if enabled
            ready: undefined, // callback on layoutready
            stop: undefined // callback on layoutstop
        };

        cy.layout(options);

    }

    function CreateProperties(properties) {
        p = properties;
        $('#idProperties').text('');
        $('#idProperties').append('<b>Properties</b>');
        $('#idProperties').css("text-decoration", "underline");
        for (var i = 0; i < p.length; i++) {
            if (p[i].Name != null) {
                $('#idProperties').append('<br>Name: ' + p[i].Name);
            }
        }

        $('#idProperties').append('<br></br>');
    }

    function CreateRequirements(requirements) {
        p = requirements;
        if (p.length === undefined) return;
        $('#idRequirements').text('');
        $('#idRequirements').append('<b>Requirements</b>');
        $('#idRequirements').css("text-decoration", "underline");
        for (var i = 0; i < p.length; i++) {
            if (p[i].Name != null) {
                $('#idRequirements').append('<br>Name: ' + p[i].Name);
            }
        }
        $('#idRequirements').append('<br></br>');
    }


    function CreateCapabilities(capabilities) {
        p = capabilities;
        if (p.length === undefined) return;
        $('#idCapabilities').text('');
        $('#idCapabilities').append('<b>Cpabilities</b>');
        $('#idCapabilities').css("text-decoration", "underline");
        for (var i = 0; i < p.length; i++) {
            if (p[i].Name != null) {
                $('#idCapabilities').append('<br>Name: ' + p[i].Name);
            }
        }
        $('#idCapabilities').append('<br></br>');
    }


    function CreateAttributes(attri) {
        p = attri;
        if (p.length === undefined) return;
        var id = $('#idAttributes');
        id.css("text-decoration", "underline");
        id.text('');
        id.append('<b>Attributes</b>');
        for (var i = 0; i < p.length; i++) {
            if (p[i].Name != null) {
                id.append('<br>Name: ' + p[i].Name);
            }
        }
        $('#idAttributes').append('<br></br>');
    }


    function CreateArtifacts(data) {
        p = data.Driver;
        var id = $('#idArtifact');
        id.text('');
        if (p.Name == null) return;
        id.append('<b>Artifacts</b>');
        id.css("text-decoration", "underline");
        //for (var i = 0; i < p.length; i++) {
        if (p != null && p.Name != null) {
            id.append('<br>Driver: ' + p.Name);
        }
        //}
        $('#idArtifact').append('<br></br>');
    }

    function createNodes(json) {
        var nodes = [];
        for (var i = 0; i < json.NodesList.length; i++) {
            nodes.push(
            {
                group: "nodes",
                data: { id: json.NodesList[i].Name, faveShape: 'heptagon', faveColor: '#0D1F45', fullname: json.NodesList[i].FullName, allData: json.NodesList[i] },
            });
        }
        return nodes;
    }

    function createEdges(json) {

        var edges = [];

        for (var i = 0; i < json.NodesList.length; i++) {
            if (json.NodesList[i].SourceName != 'Root') {
                edges.push(
                {
                    group: "edges",
                    data: { id: 'e' + i, source: json.NodesList[i].Name, target: json.NodesList[i].SourceName, faveColor: '#6FB1FC' }
                });
            }

        }

        return edges;
    }


}); // on dom ready
