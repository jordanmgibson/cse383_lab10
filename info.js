//Jordan Gibson
var URL="https://ceclnx01.cec.miamioh.edu/~johnsok9/cse383/ajax/index.php/";
var errorCounter=0;
var prevTx = 0;
var prevRx = 0;
$( document ).ready(function() {
	getRootProc();
	getLoadAvg();
	getTxRx();
});

function getRootProc() {

	a=$.ajax({
		url: URL + 'vi/api/ps',
		method: "GET"
	}).done(function(data) {
		len = data.ps.length;
		$("#processes").html("");
		for (i=0;i<len;i++) {
			$("#processes").append("<tr><td>" + data.ps[i].user+"</td><td>" + data.ps[i].pid + "</td><td>" + data.ps[i].runTime + "</td><td>" + data.ps[i].cmd + "</td></tr>");
		}
		setTimeout(getRootProc,5000);
	}).fail(function(error) {
		errorCounter++;
		$("#logRun").html(errorCounter);
		console.log("error",error.statusText);
		$("#log").prepend("ps error "+new Date()+"<br>");
		setTimeout(getRootProc,5000);
	});
}

function getLoadAvg() {

	a=$.ajax({
		url: URL + 'vi/api/loadavg',
		method: "GET"
	}).done(function(data) {
        $("#onemin").html(data.loadavg.OneMinAvg)
        $("#fivemin").html(data.loadavg.FiveMinAvg)
        $("#fifteenmin").html(data.loadavg.FifteenMinAvg)
        $("#numRunning").html(data.loadavg.NumRunning)
        $("#ttlProc").html(data.loadavg.TtlProcesses)
		setTimeout(getLoadAvg,5000);
	}).fail(function(error) {
		errorCounter++;
		$("#logRun").html(errorCounter);
		console.log("error",error.statusText);
		$("#log").prepend("loadavg error "+new Date()+"<br>");
		setTimeout(getLoadAvg,5000);
	});
}

function getTxRx() {

	a=$.ajax({
		url: URL + 'vi/api/network',
		method: "GET"
	}).done(function(data) {
		var txSec = 0;
		var rxSec = 0;
		if (prevTx != 0 && prevRx != 0) {
			txSec = data.network.txbytes - prevTx;
			rxSec = data.network.rxbytes - prevRx;
		}
		prevTx = data.network.txbytes;
		prevRx = data.network.rxbytes;
		$("#txbytes").html(data.network.txbytes);
		$("#rxbytes").html(data.network.rxbytes);
		$("#txavg").html(txSec);
		$("#rxavg").html(rxSec);
		setTimeout(getTxRx,1000);
	}).fail(function(error) {
		errorCounter++;
		$("#logRun").html(errorCounter);
		console.log("error",error.statusText);
		$("#log").prepend("network tx/rx error "+new Date()+"<br>");
		setTimeout(getTxRx,1000);
	});
}