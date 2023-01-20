const cds = require('@sap/cds');
let postActive = false;
let day, month, year, sModifiedAt;

module.exports = cds.service.impl(async (srv) => {
    const { CompanyCodesToday, Status } = srv.entities;

    srv.after('READ', CompanyCodesToday, async (data, req) => {
        // por algún motivo el POST entra luego al read, este if es para evitarlo
        if (postActive === true) return postActive = false;

        // URL --> /company-status/CompanyCodesToday?$orderby=ID desc
        const sOrderBy = req.query.SELECT.orderBy[0].sort;

        // it must be 'order by desc' because we want to check first the last records
        if (sOrderBy === 'desc') {
            //console.log(data);

            /********* Actual Date *********/
            let dActualDate = req.timestamp; // date with this format -> 2023-01-19T17:38:49.440Z
            let sActualDate = fChangeDate(dActualDate);
            console.log('FECHITA', sActualDate)
            /********* Actual Date *********/

            let bReady, sDbDate;

            data.forEach(async element => {
                bReady = element.Ready;
                sDbDate = element.Date;

                if (sDbDate === sActualDate && bReady === true) { //Ready
                    // console.log(sDbDate, sActualDate);
                    console.log(element.ID, ' ', element.CompanyCode_CompanyCode);

                    const aStatus = await SELECT(Status).where(`CompanyToday_CompanyCode = ${element.CompanyCode_CompanyCode}`).orderBy('ID desc');
        
                    aStatus.forEach(element2 => {
                        sModifiedAt = element2.modifiedAt;
                        console.log('modificao',sModifiedAt)
                    });
                    
                    console.log('Ready', aStatus);

                    // guardar o actualizar tabla status
                } else if (sDbDate === sActualDate && bReady == false) { // Not Ready
                    const aStatus = await SELECT.one(Status).where(`CompanyToday_CompanyCode = ${element.CompanyCode_CompanyCode}`).orderBy('ID desc');
                    //console.log('Not ready', aStatus);
                }
            });
        }
    });

    srv.before('CREATE', CompanyCodesToday, () => postActive = true);
});

function fChangeDate(transform) {
    day = transform.getDate();
    year = transform.getFullYear();
    month = transform.getMonth() + 1;
    if (month.toString().length === 1) month = `0${month}`;
    return transform = `${year}-${month}-${day}`;
}