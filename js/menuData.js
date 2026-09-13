// Menukort data fra Dilans Pizzaria
(function() {
    const menuItems = [
        // PIZZA
        { id: "1", name: "VESUVIO", desc: "tomatsauce, ost og skinke" },
        { id: "2", name: "KEBAB", desc: "tomatsauce, ost, kebab, salat og dressing" },
        { id: "3", name: "KØBENHAVN", desc: "tomatsauce, ost, pepperoni og champignon" },
        { id: "4", name: "HAWAII", desc: "tomatsauce, ost, skinke og ananas" },
        { id: "5", name: "MARGHERITA", desc: "tomatsauce og ost" },
        { id: "6", name: "CAPRICCIOSA", desc: "tomatsauce, ost, skinke og champignon" },
        { id: "7", name: "ITALIANA", desc: "tomatsauce, ost, kødsauce og løg" },
        { id: "8", name: "TONNY SPECIAL", desc: "tomatsauce, ost, pepperoni og ananas" },
        { id: "9", name: "MILANO", desc: "tomatsauce, ost, kebab og champignon" },
        { id: "10", name: "NAPOLI", desc: "tomatsauce, ost, kylling, salat og dressing" },
        { id: "11", name: "PEP", desc: "tomatsauce, ost og pepperoni" },
        { id: "12", name: "POLLO", desc: "tomatsauce, ost, kylling og champignon" },
        { id: "13", name: "VEGETARIA", desc: "tomatsauce, ost, champignon, paprika, artiskok og løg" },
        { id: "14", name: "APOLLO", desc: "tomatsauce, ost, kebab, løg og chili" },
        { id: "15", name: "LA LUNA", desc: "tomatsauce, ost, skinke, bacon, kebab og chili" },
        { id: "16", name: "CALZONE (indbagt)", desc: "tomatsauce, ost og skinke" },
        { id: "17", name: "BALKAN", desc: "tomatsauce, ost, friske tomater, rucola, pesto og oliven" },
        { id: "18", name: "MATADOR", desc: "tomatsauce, ost, kebab, løg og bearnaise" },
        { id: "19", name: "MAMA MIA", desc: "tomatsauce, ost, skinke og cocktailpølser" },
        { id: "20", name: "GRÆSK", desc: "tomatsauce, ost, fetaost, oliven, paprika, rucolasalat og pesto" },
        { id: "21", name: "ORIENTALE", desc: "tomatsauce, ost, cherrytomater, lufttørret skinke, rucola og pesto" },
        { id: "22", name: "AMORE", desc: "tomatsauce, ost, pepperoni, skinke og bacon" },
        { id: "23", name: "PALERMO", desc: "tomatsauce, ost, lufttørret skinke, artiskok og løg" },
        { id: "24", name: "PARMA", desc: "tomatsauce, ost, lufttørret skinke og gorgonzola" },
        { id: "25", name: "MAMMA ROSA", desc: "tomatsauce, ost, hakket kød, pepperoni og chili" },
        { id: "26", name: "POMPEI", desc: "tomatsauce, ost, skinke, løg og bacon" },
        { id: "27", name: "DELAL (indbagt)", desc: "tomatsauce, ost, kødsauce og spaghetti" },
        { id: "28", name: "DILAN", desc: "tomatsauce, ost, tun og rejer" },
        { id: "29", name: "VIKING", desc: "tomatsauce, ost, hk.oksekød, champignon og paprika" },
        { id: "30", name: "GORGONZOLA", desc: "tomatsauce, ost, kebab, gorgonzola og grøn peber" },
        { id: "31", name: "CARLO", desc: "tomatsauce, ost, skinke og pepperoni" },
        { id: "32", name: "ROMA", desc: "tomatsauce, ost, kebab, grøn peber, champignon, fetaost, salat og dressing" },
        { id: "33", name: "RHODOS", desc: "tomatsauce, ost, hk.oksekød, paprika, løg og chili" },
        { id: "34", name: "PEPPERONI", desc: "tomatsauce, ost, pepperoni og gorgonzola" },
        { id: "35", name: "PARIS", desc: "tomatsauce, ost, hakket kød, løg, jalapeños og hvidløg" },
        { id: "36", name: "ORINO", desc: "tomatsauce, ost, pepperoni, bacon og pølser" },
        { id: "37", name: "BELLO", desc: "tomatsauce, ost, kylling, fetaost, cherrytomater, rucola og pesto" },
        { id: "38", name: "NEXUS", desc: "tomatsauce, ost, bacon, kylling og pølser" },
        { id: "39", name: "AMAZON", desc: "tomatsauce, ost, kebab, grøn peber, bacon og hvidløg" },
        { id: "40", name: "INCA", desc: "tomatsauce, ost, pepperoni, hakket oksekød, jalapeños, løg og tacosauce" },
        { id: "41", name: "NEW MEXICO", desc: "tomatsauce, ost, kylling, løg, paprika, jalapeños og tacosauce" },
        { id: "42", name: "ATLANTIC", desc: "tomatsauce, ost, kebab, paprika, løg, jalapeños, tacosauce og hvidløg" },
        { id: "43", name: "DANISH", desc: "tomatsauce, ost, kartofler, rucola, cherrytomater og pesto" },
        { id: "44", name: "KARTOFFEL", desc: "tomatsauce, ost, kartofler, kylling, cherrytomater, rucola og pesto" },
        { id: "45", name: "ÅRHUS", desc: "tomatsauce, ost, kartofler, hakket oksekød, løg, jalapeños, chili og hvidløg" },
        { id: "46", name: "KRETA", desc: "tomatsauce, ost, skinke, kylling, kebab, chili og hvidløg" },
        { id: "63", name: "NY PIZZA", desc: "tomatsauce, ost, grillede auberginer, grillede squash og artiskok" },
        { id: "64", name: "NY PIZZA", desc: "tomatsauce, ost, grillede auberginer, grillede squash, kartoffel og løg" },
        { id: "65", name: "NY PIZZA", desc: "tomatsauce, mozzarella, gorgonzola og feta cheddarost" },
        
        // DURUM RULLER
        { id: "47", name: "MIX", desc: "med kebab, kylling, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "48", name: "KEBAB", desc: "med kebab, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "49", name: "KYLLING", desc: "med kylling, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "50a", name: "FALAFEL", desc: "med falafel, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "50", name: "GRÆSK BØF", desc: "med krydret græsk bøf, iceberg, tomat, agurk, løg, rødkål og dressing" },

        // BØRNE MENU
        { id: "51", name: "BØRNE PIZZA", desc: "tomatsauce, ost og skinke" },
        { id: "52", name: "BØRNE PIZZA", desc: "tomatsauce, ost og kødsauce" },
        { id: "53", name: "BØRNE PIZZA", desc: "tomatsauce, ost og pepperoni" },
        { id: "54", name: "FISKEFILET", desc: "med pommes frites og remoulade" },
        { id: "162", name: "BØRNE CHICKEN DIPPER", desc: "med pommes frites og remoulade" },
        { id: "163", name: "BØRNEBURGER MENU", desc: "med lille cola, pommes frites og mayonnaise" },

        // PASTA
        { id: "55", name: "LASAGNE", desc: "med kødsauce" },
        { id: "56", name: "LASAGNE", desc: "med kødsauce, ost og gorgonzola" },
        { id: "57", name: "LASAGNE", desc: "med kødsauce og bacon" },
        { id: "58", name: "SPAGHETTI BOLOGNESE", desc: "med kødsauce" },
        { id: "59", name: "CARBONARA SPAGHETTI", desc: "med bacon, æg og flødesauce" },
        { id: "60", name: "POMODORI SPAGHETTI", desc: "med kylling, bacon, paprika og tomat-flødesauce" },
        { id: "61", name: "LUCABNA SPAGHETTI", desc: "med gorgonzola, kebab, champignon og fløde-tomatsauce" },
        { id: "62", name: "A LA MATICA", desc: "spaghetti med bacon, champignon og fløde-tomatsauce" },

        // BURGERE
        { id: "69", name: "DILANS BURGER", desc: "med bøf, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "70", name: "DILANS BURGER", desc: "med ost, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "71", name: "DILANS BURGER", desc: "med bacon, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "72", name: "DILANS BURGER", desc: "med bacon, ost, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "73", name: "DOBBELT BURGER", desc: "med 2 bøffer, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "74", name: "DOBBELT BURGER", desc: "med 2 bøffer, ost, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "75", name: "DOBBELT BURGER", desc: "med 2 bøffer, ost, bacon, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "76", name: "DOBBELT BURGER", desc: "med 2 bøffer, bløde løg, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "77", name: "KYLLINGEBURGER", desc: "med kyllingefilet, creme fraiche, tomat, agurk og iceberg" },
        { id: "78", name: "KYLLINGEBURGER", desc: "med kyllingefilet, bacon, creme fraiche, tomat, agurk og iceberg" },

        // STORE BURGERE
        { id: "79", name: "JAGT BURGER", desc: "hjemmelavet stor burger med tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "80", name: "JAGT BURGER", desc: "hjemmelavet stor burger med ost, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "81", name: "JAGT BURGER", desc: "hjemmelavet stor burger med bacon, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "82", name: "JAGT BURGER", desc: "hjemmelavet stor burger med ost, bacon, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "83", name: "JAGT BURGER", desc: "hjemmelavet stor burger med ost, bacon, spejlæg, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "84", name: "JAGT BURGER (mexicansk)", desc: "hjemmelavet stor burger med chili, jalapeños, tomat, agurk, ketchup og salatmayonnaise" },
        { id: "85", name: "JAGT BURGER", desc: "hjemmelavet stor burger i hjemmelavet brød med tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "164", name: "JAGT DOBBELT BURGER", desc: "hjemmelavet dobbelt burger med 2 bøffer, tomat, agurk, ketchup, iceberg og salatmayonnaise" },
        { id: "165", name: "JAGT BURGER", desc: "hjemmelavet stor burger med bløde løg og bearnaisesauce" },

        // PITABRØD
        { id: "86", name: "KEBAB", desc: "i pitabrød med kebab, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "87", name: "KEBAB", desc: "i pitabrød med kebab, bacon, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "88", name: "KYLLING", desc: "i pitabrød med kylling, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "89", name: "KYLLING", desc: "i pitabrød med kylling, bacon, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "90", name: "GRÆSK BØF", desc: "i pitabrød med krydret græsk bøf, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "91", name: "FALAFEL", desc: "i pitabrød med falafel, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "92", name: "VÆLG MELLEM", desc: "i pitabrød med skinke, tun eller rejer, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "105", name: "MIX", desc: "i pitabrød med kebab, kylling, iceberg, tomat, agurk, løg, rødkål og dressing" },

        // PIZZA SANDWICH (PANINO)
        { id: "93", name: "KEBAB", desc: "i friskbagt pizzabrød med kebab, ost, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "94", name: "KEBAB", desc: "i friskbagt pizzabrød med kebab, bacon, ost, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "95", name: "KYLLING", desc: "i friskbagt pizzabrød med kylling, ost, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "96", name: "KYLLING", desc: "i friskbagt pizzabrød med kylling, bacon, ost, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "97", name: "GRÆSK BØF", desc: "i friskbagt pizzabrød med krydret græsk bøf, ost, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "98", name: "FALAFEL", desc: "i friskbagt pizzabrød med falafel, ost, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "99", name: "VÆLG MELLEM", desc: "i friskbagt pizzabrød med skinke, rejer, pepperoni, gorgonzola el. tun, ost, salat og dressing" },
        { id: "100", name: "MIX", desc: "i friskbagt pizzabrød med kebab, kylling, ost, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "101", name: "PIZZA SANDWICH MENU", desc: "valgfri pizza sandwich med lille pommes frites, dåsesodavand og mayonnaise" },

        // A LA CARTE
        { id: "102", name: "HUSETS BØF (2 stk.)", desc: "hjemmelavede bøffer med pommes frites, bearnaisesauce, salat og dressing" },
        { id: "103", name: "GRÆSK BØF (2 stk.)", desc: "hjemmelavede krydderbøffer med pommes frites, bearnaisesauce, salat og dressing" },
        { id: "104", name: "KEBAB RET", desc: "med kebab, pommes frites, bearnaisesauce, salat, dressing og brød" },
        { id: "108", name: "CHICKEN DIPPER 10 stk.", desc: "med pommes frites, remoulade, salat og dressing" },
        { id: "110", name: "FISKEFILET 2 stk.", desc: "med pommes frites, remoulade, salat og dressing" },
        { id: "111", name: "HOTWINGS OG INDERFILET", desc: "med pommes frites, mayonnaise, salat og dressing" },
        { id: "112", name: "1/2 KYLLING", desc: "grillkylling uden tilbehør" },
        { id: "113", name: "1/2 KYLLING", desc: "med pommes frites, salat, remoulade og dressing" },
        { id: "115", name: "KYLLING RET", desc: "med kyllingestrimler, pommes frites, salat, bearnaisesauce og dressing" },
        { id: "116", name: "OKSEFILET", desc: "med pommes frites, bearnaisesauce, salat og dressing" },
        { id: "117", name: "OKSEFILET", desc: "med kartoffelbåde, gorgonzolasauce, salat og dressing" },
        { id: "118", name: "OKSEFILET", desc: "med kartoffelbåde, champignonsauce, salat og dressing" },
        { id: "119", name: "OKSEFILET", desc: "med kartoffelbåde, pebersauce, salat og dressing" },

        // NACHOS
        { id: "121", name: "NACHOS", desc: "sprøde tortillachips med cheddarost, salsa, guacamole og jalapeños" },
        { id: "122", name: "NACHOS", desc: "sprøde tortillachips med kylling, cheddarost, salsa, guacamole og jalapeños" },
        { id: "123", name: "NACHOS", desc: "sprøde tortillachips med hakket oksekød, cheddarost, salsa, guacamole og jalapeños" },

        // STORE SALATER
        { id: "124", name: "NATUREL SALAT", desc: "med flutes, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "125", name: "GRÆSK SALAT", desc: "med fetaost, oliven, flutes, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "126", name: "TUN SALAT", desc: "med tun, flutes, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "127", name: "REJE SALAT", desc: "med rejer, flutes, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "128", name: "KYLLING SALAT", desc: "med kylling, flutes, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "129", name: "KYLLING & BACON SALAT", desc: "med kylling, sprød bacon, flutes, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "130", name: "KEBAB SALAT", desc: "med kebab, flutes, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "131", name: "SKINKE & OST SALAT", desc: "med skinke, ost, flutes, iceberg, tomat, agurk, løg, rødkål og dressing" },

        // BAGT KARTOFFEL
        { id: "132", name: "CREME FRAICHE DRESSING", desc: "bagt kartoffel med creme fraiche dressing, iceberg, tomat, agurk, løg og rødkål" },
        { id: "133", name: "KYLLING & BACON", desc: "bagt kartoffel med kylling, bacon, iceberg, tomat, agurk, løg, rødkål og dressing" },
        { id: "134", name: "VÆLG MELLEM", desc: "bagt kartoffel med kebab, kylling, falafel el. skinke, samt salat og dressing" },
        { id: "150", name: "BAGT KARTOFFEL", desc: "bagt kartoffel med tun eller rejer, samt salat og dressing" },

        // POMMES FRITES & DIVERSE
        { id: "135", name: "POMMES FRITES", desc: "lille portion sprøde pommes frites" },
        { id: "136", name: "POMMES FRITES", desc: "stor portion sprøde pommes frites" },
        { id: "137", name: "FORÅRSRULLE", desc: "150g kinesisk forårsrulle" },
        { id: "138", name: "HVIDLØGSBRØD", desc: "varmt ovnbagt hvidløgsbrød med ost og hvidløg" },
        { id: "139", name: "KARTOFFELBÅDE", desc: "lille portion krydrede kartoffelbåde" },
        { id: "140", name: "KARTOFFELBÅDE", desc: "stor portion krydrede kartoffelbåde" },
        { id: "141", name: "BOX", desc: "med kebab, kylling el. falafel, iceberg, tomat, agurk, løg, rødkål, pommes frites og dressing" },
        { id: "142", name: "BOX MIX KEBAB OG KYLLING", desc: "med både kebab og kylling, iceberg, tomat, agurk, løg, rødkål, pommes frites og dressing" },
        { id: "143", name: "SNACK MIX", desc: "3 stk. chicken nuggets, 3 chili cheese, 3 mozzarella sticks, 3 løgringe med salatmayo" }
    ];

    const vegetarIds = ["5", "13", "63", "64", "65", "50a", "91", "98", "121", "124", "125", "132", "135", "136", "138", "139", "140"];
    const pescetarIds = [...vegetarIds, "28", "54", "110", "126", "127", "150"];

    function getCategoryForID(id) {
        if (!id) return "";
        if (id === "50a") return "DURUM RULLER";
        const num = parseInt(id, 10);
        if (!num) return "";
        
        if ((num >= 1 && num <= 46) || (num >= 63 && num <= 65)) return "PIZZA";
        if (num >= 47 && num <= 50) return "DURUM RULLER";
        if ((num >= 51 && num <= 54) || num === 162 || num === 163) return "BØRNE MENU";
        if (num >= 55 && num <= 62) return "PASTA";
        if (num >= 69 && num <= 78) return "BURGERE";
        if ((num >= 79 && num <= 85) || num === 164 || num === 165) return "STORE BURGERE";
        if ((num >= 86 && num <= 92) || num === 105) return "PITABRØD";
        if (num >= 93 && num <= 101) return "PIZZA SANDWICH (PANINO)";
        if ((num >= 102 && num <= 119)) return "A LA CARTE";
        if (num >= 121 && num <= 123) return "NACHOS";
        if (num >= 124 && num <= 131) return "STORE SALATER";
        if ((num >= 132 && num <= 134) || num === 150) return "BAGT KARTOFFEL";
        if (num >= 135 && num <= 143) return "POMMES FRITES & DIVERSE";
        
        return "";
    }

    window.DilanMenu = {
        menuItems,
        vegetarIds,
        pescetarIds,
        getCategoryForID
    };
})();
