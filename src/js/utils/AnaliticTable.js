module.exports = {
    create: function(data){
        if(!data.length) return '';

        var typeList = {
            date: 'дата',
            string: 'строка',
            number: 'число'
        };

        var rows = data.map(function(obj){
            if(obj.name && obj.type && obj.fillPercent && obj.unicValues){
                var fillPercent = (obj.fillPercent + "").substring(0, 5);
                var row = '<tr>';
                row += '<td>' + obj.name + '</td>';
                row += '<td>' + fillPercent + '</td>';
                row += '<td>' + obj.unicValues + '</td>';
                row += '<td>' + typeList[obj.type] + '</td>';
                row += '</tr>';
                return row;
            }
        });

        var header = '<tr>';
        header += '<th>Имя</th>';
        header += '<th>Заполн. непустыми знач., %</th>';
        header += '<th>Кол-во уник. знач.</th>';
        header += '<th>Тип</th>';
        header += '</tr>';

        return '<table class="analiticTable">' + header + rows.join('') + '</table>';
    }
};