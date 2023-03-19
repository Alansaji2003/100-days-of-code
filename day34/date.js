module.exports = getDate

function getDate(){
    var days = new Date;
    var options = {
        weekday: 'long',
        
        month: 'long',
        day: 'numeric'
    }
    
    var currentDate = days.toLocaleDateString("en-US", options)
    return currentDate
}
