var NodesValidation = {

    getRule: function(){
        return {
            name : 'validate_nodes',
            validatorFunction : function(value, $el, config, language, $form) {

                var lines = value.split('\n');

                for(var i = 0 ; i < lines.length ; i++){
                    // Empty lines it is not allowed
                    if( ! lines[i]) return false;

                    var values = lines[i].split(";");

                    // Should be have at least three components
                    if(values.length != 3){
                        return false;
                    }

                    if( ! values[0]) return false;
                    if( ! $.isNumeric(values[1])) return false;
                    if( ! $.isNumeric(values[2])) return false;
                }
                return true;
            },
            errorMessage : 'The patterns is (source;group;size). Empty lines it is not allowed',
            errorMessageKey: 'validate_nodes'
        }
    }
};
