$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDljTa80OauQf4oHPLkFOBzQA3o6DlZqAM",
        authDomain: "bootcamp-first-test-proj-4f4a0.firebaseapp.com",
        databaseURL: "https://bootcamp-first-test-proj-4f4a0.firebaseio.com",
        projectId: "bootcamp-first-test-proj-4f4a0",
        storageBucket: "bootcamp-first-test-proj-4f4a0.appspot.com",
        messagingSenderId: "696335395576"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    var newTrain = {
        trainName: "Train Name",
        destination: "Destination",
        firstTrainTime: "First Train Time",
        frecuency: 3,
    }




    $("#new-train-submit").on("click", function (event) {
        // Don't refresh the page!
        event.preventDefault();

        var inputTrainName = $("#train-name").val().trim();
        var inputDestionation = $("#destination").val().trim();
        var inputFirstTrainTime = $("#first-train-time").val().trim();
        var inputFrecuency = $("#frecuency").val().trim();

        newTrain.trainName = inputTrainName;
        newTrain.destination = inputDestionation;
        newTrain.firstTrainTime = inputFirstTrainTime;
        newTrain.frecuency = inputFrecuency;

        database.ref("TrainScheduler").push({
            TrainName: newTrain.trainName,
            Destination: newTrain.destination,
            TrainFirstTime: newTrain.firstTrainTime,
            Frecuency: newTrain.frecuency,
            Time: firebase.database.ServerValue.TIMESTAMP
        });
    });


    database.ref("TrainScheduler").on("child_added", function (snapshot) {

        AddTrainToTable(snapshot.val(), snapshot.key);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    database.ref("TrainScheduler").on("child_removed", function (snapshot) {

        RemoveTrainFromTable(snapshot.key);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    $(document).on("click", "#removeTrain", function() {
        // Don't refresh the page!
        // console.log("holi");
        database.ref("TrainScheduler").child($(this).attr("data-id")).remove();
    });

    function RemoveTrainFromTable(key){
        $("#"+key).remove();
    }

    function AddTrainToTable(data, key) {

        // train math
        var firstTimeConverted = moment(data.TrainFirstTime, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % data.Frecuency;
        var tMinutesTillTrain = data.Frecuency - tRemainder;
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        var tablebody = $("#table-body");

        var table = $("<tr>");
        table.attr("id", key);

        var dest = $("<td>");
        dest.text(data.Destination);

        var tName = $("<td>");
        tName.text(data.TrainName);

        var frec = $("<td>");
        frec.text(data.Frecuency);

        var nextTrainHour = $("<td>");
        nextTrainHour.text(moment(nextTrain).format("hh:mm"));

        var nextTraininMin = $("<td>");
        nextTraininMin.text(tMinutesTillTrain);

        var removeButton = $("<button>");
        var trainId = key;
        removeButton.addClass("btn btn-primary remove-button");
        removeButton.attr("data-id", trainId);
        removeButton.attr("id", "removeTrain");
        var icon = $("<i class='icon-trash'></i> icon-trash")
        removeButton.append(icon);

        table.append(tName);
        table.append(dest);
        table.append(frec);
        table.append(nextTrainHour);
        table.append(nextTraininMin);
        table.append(removeButton);

        tablebody.append(table);

    }

});