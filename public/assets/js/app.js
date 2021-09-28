$(document).ready(function () {
  var colorsTable;
  function renderColorTable(data) {
    colorsTable = $("#colorsTable").DataTable({
      dom:
        "<'row justify-content-between'<'col-sm-12 col-md-2'l><'col-sm-12 col-md-4'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-4'i><'col-sm-12 col-md-8'p>>",
      data: data,
      rowId: "id",
      responsive: true,
      columns: [
        {
          data: "id",
          className: "id",
        },
        {
          data: "colorName",
          className: "colorName text-center",
          render: function (data, type, row, meta) {
            return '<a href="/colors/' + row.id + '">' + data + "</a>";
          },
        },
        {
          data: "category",
          className: "category text-center",
        },
        {
          data: "colorType",
          className: "colorType text-center",
        },
        {
          data: "hex",
          className: "hex text-center",
          render: function (data, row, type, meta) {
            return (
              '<span class="hexColor mr-2" style="background-color: ' +
              data +
              ' "></span><span>' +
              data +
              "</span>"
            );
          },
        },
        {
          data: "id",
          className: "text-center",
          render: function (data, row, type, meta) {
            return (
              '<a href="/colors/' +
              data +
              '/update" class="btn btn-warning btn-sm mr-2">Edit</a><a href="/colors/' +
              data +
              '/delete" class="btn btn-danger btn-sm" onclick="return confirm(`Are you sure you want to delete this Color?`)">Delete</a>'
            );
          },
        },
      ],
    });
  }

  $.ajax({
    url: "/api/colors",
    type: "GET",
    error: function () {
      callback();
    },
    success: function (res) {
      renderColorTable(res);
      $("#searchTerm").selectize({
        maxItems: 1,
        create: false,
        valueField: "colorName",
        labelField: "colorName",
        searchField: ["colorName", "hex", "colorType"],
        preload: true,
        render: {
          option: function (item, escape) {
            return "<div>" + escape(item.colorName) + "</div>";
          },
        },
        load: function (query, callback) {
          if (!query.length) return callback();
          callback(res);
        },
        onChange: function (value) {
          $("#searchButton").attr(
            "href",
            "/colors/" + $("#searchTerm")[0].selectize.options[value].id
          );
        },
      });
    },
  });

  fetch("https://restcountries.com/v3/all")
    .then(function (data) {
      return data.json();
    })
    .then((data) => {
      var countryData = [];

      data.forEach((c) => {
        if (c.hasOwnProperty("capital") === false) {
          console.log(c);
        } else {
          let cData = {
            countryName: c.name.common,
            countryCode: c.cca2,
            countryCapital: c.capital[0],
            region: c.region,
            subregion: c.subregion,
          };
          countryData.push(cData);
        }
      });

      $("#countryCodes").selectize({
        maxItems: 1,
        create: false,
        valueField: "countryCode",
        labelField: "countryName",
        searchField: ["countryName", "countryCode", "region", "subregion"],
        sortField: "countryCode",
        preload: true,
        closeAfterSelect: true,
        render: {
          option: function (item, escape) {
            return (
              "<div>" +
              escape(item.countryCode + " - " + item.countryName) +
              "</div>"
            );
          },
        },
        load: function (query, callback) {
          if (!query.length) return callback();
          callback(countryData);
        },
        onChange: function (value) {
          loadCovidData();
        },
      });
    });

  function loadCovidData() {
    var countryCode = $("#countryCodes")[0].selectize.getValue();
    var apiUrl = "/api/covid19/" + countryCode;
    if (countryCode.length < 1) {
      apiUrl = "/api/covid/totals";
    }
    fetch(apiUrl)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if (data[0].country !== undefined) {
          $("#resultsHeader").text(`Covid-19 data for ${data[0].country}`);
        } else {
          $("#resultsHeader").text(`Worldwide Covid-19 data`);
        }
        $("#confirmed").text(data[0].confirmed);
        $("#recovered").text(data[0].recovered);
        $("#critical").text(data[0].critical);
        $("#deaths").text(data[0].deaths);
        $("#covidResults").removeClass("d-none");
      });
  }
});
