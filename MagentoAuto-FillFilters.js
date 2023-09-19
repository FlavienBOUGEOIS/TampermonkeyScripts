// ==UserScript==
// @name         Magento2 Auto-Fill Filters
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-fill purchase date filter and disable search bar
// @author       Vous
// @match        https://prod-admin.easypara.fr/admin_easy/sales/order/index/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour calculer la date de la veille
    function getLastDayDate() {
        const today = new Date();
        let lastDay = new Date(today);
        lastDay.setDate(today.getDate() - 1);
        return `${("0" + lastDay.getDate()).slice(-2)}/${("0" + (lastDay.getMonth() + 1)).slice(-2)}/${lastDay.getFullYear()}`;
    }

    // Fonction pour calculer la date d'il y a 7 jours (dernière semaine)
    function getLastWeekDate() {
        const today = new Date();
        let lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return `${("0" + lastWeek.getDate()).slice(-2)}/${("0" + (lastWeek.getMonth() + 1)).slice(-2)}/${lastWeek.getFullYear()}`;
    }

    // Fonction pour calculer la date du dernier mois
    function getLastMonthDate() {
        const today = new Date();
        let lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        return `${("0" + lastMonth.getDate()).slice(-2)}/${("0" + (lastMonth.getMonth() + 1)).slice(-2)}/${lastMonth.getFullYear()}`;
    }

    var observerForDate = new MutationObserver(function() {
        //console.log('ObserverForDate activé');
        const purchaseDateInput = document.querySelector('input[name="created_at[from]"]');
        const applyButton = document.querySelector('button[data-action="grid-filter-apply"]');

        if (purchaseDateInput && applyButton) {
            //console.log('Champ Purchase Date trouvé');
            purchaseDateInput.value = getLastDayDate();//You can use her : getLastDayDate, getLastWeekDate, getLastMonthDate
            purchaseDateInput.dispatchEvent(new Event('change', {'bubbles': true})); // déclenche un événement 'change'
            //console.log('Valeur du champ modifiée');

            applyButton.click(); // Simule un clic sur le bouton "Appliquer"
            //console.log('Bouton Appliquer cliqué');

            setTimeout(() => observerForDate.disconnect(), 1000);
        }
    });

    var observerForSearchBar = new MutationObserver(function() {
        const searchBar = document.querySelector('input[id="fulltext"]');

        if (searchBar) {
            searchBar.disabled = true;
            observerForSearchBar.disconnect(); // Désactive cet observateur après la première modification
        }
    });

    // Configuration de l'observateur
    var config = { attributes: false, childList: true, characterData: false, subtree: true };

    observerForDate.observe(document.body, config);
    observerForSearchBar.observe(document.body, config);
})();
