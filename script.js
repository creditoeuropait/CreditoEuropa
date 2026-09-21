/* =====================================================
   CREDITOEUROPA
   JAVASCRIPT
===================================================== */


/* =====================================================
   DONNEES DES PRETS
===================================================== */

const loanData = {

    personale: {

        name: "Prestito personale",

        minAmount: 5000,

        maxAmount: 115000,

        minMonths: 24,

        maxMonths: 180,

        defaultAmount: 20000,

        defaultMonths: 60
    },


    senza: {

        name: "Prestito senza busta paga",

        minAmount: 2000,

        maxAmount: 75000,

        minMonths: 12,

        maxMonths: 120,

        defaultAmount: 15000,

        defaultMonths: 48
    },


    studenti: {

        name: "Prestito per studenti",

        minAmount: 1000,

        maxAmount: 100000,

        minMonths: 12,

        maxMonths: 180,

        defaultAmount: 10000,

        defaultMonths: 60
    }

};


/* =====================================================
   TAUX FIXE DE SIMULATION
===================================================== */

const FIXED_ANNUAL_RATE = 0.05;


/* =====================================================
   ELEMENTS
===================================================== */

const loanType =
    document.getElementById("loanType");

const amount =
    document.getElementById("amount");

const duration =
    document.getElementById("duration");

const amountInfo =
    document.getElementById("amountInfo");

const durationInfo =
    document.getElementById("durationInfo");

const monthlyPayment =
    document.getElementById("monthlyPayment");

const resultAmount =
    document.getElementById("resultAmount");

const resultDuration =
    document.getElementById("resultDuration");

const resultInterest =
    document.getElementById("resultInterest");

const resultTotal =
    document.getElementById("resultTotal");


/* =====================================================
   FORMAT EURO ITALIEN
===================================================== */

function formatEuro(value) {

    return new Intl.NumberFormat(
        "it-IT",
        {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(value);

}


/* =====================================================
   FORMAT NOMBRE
===================================================== */

function formatNumber(value) {

    return new Intl.NumberFormat(
        "it-IT"
    ).format(value);

}


/* =====================================================
   CREER LES OPTIONS DE DUREE
===================================================== */

function updateDurations() {

    const data =
        loanData[loanType.value];


    duration.innerHTML = "";


    /*
     * Les durées sont proposées
     * par tranches de 12 mois.
     */

    for (
        let month = data.minMonths;
        month <= data.maxMonths;
        month += 12
    ) {

        const option =
            document.createElement("option");


        option.value =
            month;


        option.textContent =
            `${month} mesi`;


        duration.appendChild(option);

    }


    /*
     * Si la durée maximale n'est pas
     * atteinte exactement.
     */

    if (
        data.maxMonths % 12 !== 0
        &&
        data.maxMonths > data.minMonths
    ) {

        const option =
            document.createElement("option");


        option.value =
            data.maxMonths;


        option.textContent =
            `${data.maxMonths} mesi`;


        duration.appendChild(option);

    }


    /*
     * Sélection de la durée par défaut.
     */

    let defaultDuration =
        data.defaultMonths;


    if (
        defaultDuration < data.minMonths
        ||
        defaultDuration > data.maxMonths
    ) {

        defaultDuration =
            data.minMonths;

    }


    duration.value =
        defaultDuration;

}


/* =====================================================
   CHANGEMENT DU TYPE DE PRET
===================================================== */

function updateLoanType() {

    const data =
        loanData[loanType.value];


    /*
     * Limites montant
     */

    amount.min =
        data.minAmount;

    amount.max =
        data.maxAmount;

    amount.value =
        data.defaultAmount;


    /*
     * Texte informatif
     */

    amountInfo.textContent =
        `Da ${formatNumber(data.minAmount)} € a ${formatNumber(data.maxAmount)} €`;


    durationInfo.textContent =
        `${data.minMonths} – ${data.maxMonths} mesi`;


    /*
     * Durées
     */

    updateDurations();


    /*
     * Recalcul
     */

    calculateLoan();

}


/* =====================================================
   CALCUL DE LA MENSUALITE
===================================================== */

function calculateLoan() {

    const data =
        loanData[loanType.value];


    /*
     * IMPORTANT :
     * Si le client est en train d'effacer
     * le champ pour saisir un nouveau montant,
     * on ne force PAS immédiatement le minimum.
     */

    if (
        amount.value === ""
        ||
        amount.value === null
    ) {

        return;

    }


    let principal =
        Number(amount.value);


    let months =
        Number(duration.value);


    /*
     * Si la valeur n'est pas un nombre,
     * on ne calcule pas.
     */

    if (
        Number.isNaN(principal)
        ||
        principal <= 0
    ) {

        return;

    }


    /*
     * Sécurité montant minimum.
     *
     * Cette correction intervient uniquement
     * si une valeur numérique inférieure au
     * minimum est réellement saisie.
     */

    if (
        principal < data.minAmount
    ) {

        return;

    }


    /*
     * Sécurité montant maximum.
     */

    if (
        principal > data.maxAmount
    ) {

        return;

    }


    /*
     * Sécurité durée.
     */

    if (
        !months
        ||
        months < data.minMonths
        ||
        months > data.maxMonths
    ) {

        return;

    }


    /*
     * Taux mensuel.
     *
     * 5% annuel / 12
     */

    const monthlyRate =
        FIXED_ANNUAL_RATE / 12;


    /*
     * Formule de mensualité
     * à taux fixe.
     */

    const payment =
        principal *
        monthlyRate *
        Math.pow(
            1 + monthlyRate,
            months
        )
        /
        (
            Math.pow(
                1 + monthlyRate,
                months
            ) - 1
        );


    /*
     * Total remboursé.
     */

    const total =
        payment * months;


    /*
     * Intérêts estimés.
     */

    const interest =
        total - principal;


    /*
     * Affichage.
     */

    monthlyPayment.textContent =
        formatEuro(payment);


    resultAmount.textContent =
        formatEuro(principal);


    resultDuration.textContent =
        `${months} mesi`;


    resultInterest.textContent =
        formatEuro(interest);


    resultTotal.textContent =
        formatEuro(total);

}


/* =====================================================
   VALIDATION DU MONTANT
===================================================== */

function validateAmount() {

    const data =
        loanData[loanType.value];


    let principal =
        Number(amount.value);


    /*
     * Si le champ est vide,
     * on remet le montant par défaut
     * uniquement lorsque le client quitte
     * le champ.
     */

    if (
        amount.value === ""
        ||
        Number.isNaN(principal)
    ) {

        amount.value =
            data.defaultAmount;

        calculateLoan();

        return;

    }


    /*
     * Montant inférieur au minimum.
     */

    if (
        principal < data.minAmount
    ) {

        amount.value =
            data.minAmount;

    }


    /*
     * Montant supérieur au maximum.
     */

    if (
        principal > data.maxAmount
    ) {

        amount.value =
            data.maxAmount;

    }


    calculateLoan();

}


/* =====================================================
   EVENTS SIMULATEUR
===================================================== */


/*
 * Changement du type de prêt
 */

loanType.addEventListener(
    "change",
    updateLoanType
);


/*
 * Saisie du montant
 *
 * Le calcul se fait immédiatement
 * uniquement lorsque la valeur est valide.
 */

amount.addEventListener(
    "input",
    function () {

        if (
            amount.value !== ""
            &&
            Number(amount.value) > 0
        ) {

            calculateLoan();

        }

    }
);


/*
 * Lorsque le client quitte le champ,
 * on vérifie les limites.
 */

amount.addEventListener(
    "blur",
    validateAmount
);


/*
 * Touche Entrée
 */

amount.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            validateAmount();

            amount.blur();

        }

    }
);


/*
 * Changement de durée
 */

duration.addEventListener(
    "change",
    calculateLoan
);


/* =====================================================
   INITIALISATION
===================================================== */

updateLoanType();


/* =====================================================
   MENU MOBILE
===================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const navigation =
    document.getElementById("navigation");


if (
    menuToggle
    &&
    navigation
) {

    menuToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                navigation.classList.toggle("active");


            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    /*
     * Fermer le menu après avoir
     * cliqué sur un lien.
     */

    document
        .querySelectorAll("#navigation a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation.classList.remove(
                            "active"
                        );


                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );

}


/* =====================================================
   FAQ ACCORDEON
===================================================== */

const faqItems =
    document.querySelectorAll(".faq-item");


faqItems.forEach(
    function (item) {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");


        if (
            !question
            ||
            !answer
        ) {

            return;

        }


        question.addEventListener(
            "click",
            function () {

                const currentlyActive =
                    item.classList.contains("active");


                /*
                 * Fermer les autres.
                 */

                faqItems.forEach(
                    function (otherItem) {

                        otherItem.classList.remove(
                            "active"
                        );


                        const otherAnswer =
                            otherItem.querySelector(
                                ".faq-answer"
                            );


                        if (otherAnswer) {

                            otherAnswer.style.maxHeight =
                                null;

                        }

                    }
                );


                /*
                 * Ouvrir celui sélectionné.
                 */

                if (
                    !currentlyActive
                ) {

                    item.classList.add(
                        "active"
                    );


                    answer.style.maxHeight =
                        answer.scrollHeight + "px";

                }

            }
        );

    }
);


/* =====================================================
   ANIMATION DOUCE DES BOUTONS
===================================================== */

document
    .querySelectorAll(
        ".btn, .contact-button, .card-button"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "mouseenter",
                function () {

                    button.style.willChange =
                        "transform";

                }
            );


            button.addEventListener(
                "mouseleave",
                function () {

                    button.style.willChange =
                        "auto";

                }
            );

        }
    );
