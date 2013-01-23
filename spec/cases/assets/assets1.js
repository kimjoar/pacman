exports.config = {

  ignore_processing: ["/templates/"],

  assets: {

    js: {
        group1: [ "/js/1.js" ],
        group2: "/js2",
        duplicates: [ "/js/1.js", "/js" ]
    },

    css: {
        group3: [ "/css" ]
    }
  }

};
