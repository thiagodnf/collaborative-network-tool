var ConvertUtils = {

    fromStringToNodes: function(nodes){
        var lines = nodes.split("\n");

        var nodes = [];

        for(var i=0;i<lines.length;i++){
            var values = lines[i].split(";");

            nodes.push({"id": values[0], "group": values[1], "size": values[2]})
        }

        return nodes;
    },
    fromStringToEdges: function(nodes){
        var lines = nodes.split("\n");

        var edges = [];

        for(var i=0;i<lines.length;i++){
            var values = lines[i].split(";");

            edges.push({"source": values[0], "target": values[1], "value": values[2]});
        }

        return edges;
    },
    toGraph: function(nodes, edges){
        var nodes = {
            "nodes": nodes,
            "links": edges
        };

        return nodes;
    },
    fromBibtexToEntries: function(content){
        console.log("Parsing...");

        // Creating the bibtex object for parse the bibtext file
        var bibtex = new BibTex();

        // Getting the div's content for parse it
        bibtex.content = content;

        // Parse the bibtext file
        bibtex.parse();

        console.log("Processing the entries...");

         // Array with all entries
        var entries = [];

        // Save all converted entries
        for (var index = 0; index < bibtex.data.length; index++) {
            entries.push(bibtex.data[index]);
        }

        return entries;
    },
    fromBibtexEntriesToGraph: function(entries){
        var nodesTmp = {};
        var edgesTmp = {}

        $.each(entries, function(index, entry){
            if(entry.entryType == "mastersthesis") return;
            if(entry.entryType == "phdthesis") return;

            for(var i = 0; i < entry.author.length; i++){
                var author1 = entry.author[i].last;

                if( ! nodesTmp[author1]){
                    nodesTmp[author1] = 0;
                }

                nodesTmp[author1]++;

                for(var j = 0; j < entry.author.length; j++){
                    var author2 = entry.author[j].last;

                    if(author1 == author2){
                        continue
                    }

                    if( ! edgesTmp[author1+"@@@"+author2]){
                        edgesTmp[author1+"@@@"+author2] = 0;
                    }

                    edgesTmp[author1+"@@@"+author2]++;
                }
            }
        });

        var nodeString = [];

        for(var i in nodesTmp){
            nodeString.push(i+";1;"+nodesTmp[i]);
        }

        nodeString = nodeString.join("\n");

        var edgesString = [];

        for(var i in edgesTmp){
            var split = i.split("@@@");

            edgesString.push(split[0]+";"+split[1]+";"+edgesTmp[i]);
        }

        edgesString = edgesString.join("\n");

        var nodes = this.fromStringToNodes(nodeString);
        var edges = this.fromStringToEdges(edgesString);

        return this.toGraph(nodes, edges);
    }
}
