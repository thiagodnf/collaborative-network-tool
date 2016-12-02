var ExampleUtils = {

    getNodes: function(){
        var nodes = "";

        nodes += "A;1;2\n";
        nodes += "B;1;3\n";
        nodes += "C;2;2\n";
        nodes += "D;2;1";

        return nodes;
    },
    getEdges: function(){
        var edges = "";

        edges += "A;B;2\n";
        edges += "B;C;1\n";
        edges += "A;D;4";

        return edges;
    },
    getBibtex: function(){
        return "https://raw.githubusercontent.com/gres-ufpr/basic-informations/master/publications.bib";
    }
}
