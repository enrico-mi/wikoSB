<script>

import { base } from "$app/paths";

import Header from '$lib/Header.svelte';
import CollegeIncome from '$lib/CollegeIncome.svelte';

</script>

<nav>
    <a href="{base}/">home</a>
</nav>

<Header />

<h1>
    Data Visualization:<br> US Colleges Admission and Household Income
</h1>
<br>

<p>
    Visualization: Tableau Public <br>
    Geocoding: Python, Google Maps API <br>
    <br>

    This project was inspired by The Upshot <span>&#8212;</span> New York Times reporting on a recent study that quantifies the beneficial effect that being very rich has on admissions to US elite colleges.

    I found that the data and the message of the original article could benefit from a few features. The first one, is describing the household income in terms of US dollars, and not population percentile, making more immediate to the user where they fall in the distribution. A second feature is the interactive element that asks the user to choose an household income at the start of the dashboard, making the data more personal. A third feature is the mapping of the data: as soon as the user selects an income range, they immediatly see at a glance where their household income is penalized or advantegeous. <br>

    The dashboard was submitted to <a href="https://www.cleartelligence.com/post/chart-champ-2023-recap">Chart Champ 2023</a>, where it won 3rd place. <br>

    The Upshot article is <a href="https://www.nytimes.com/interactive/2023/07/24/upshot/ivy-league-elite-college-admissions.html" target="_blank">here.</a> <br>

    The Harvard study is <a href="https://opportunityinsights.org/paper/collegeadmissions/" target="_blank">here.</a> <br>
    More details are in the dashboard below.
</p>

<div class="tableau"> <CollegeIncome /> </div>


<style>
h1 {
    width: 500px;
    text-align: center;
    margin: 0 auto
}

p {
    width: 1000px;
    text-align: justify;
    margin: 0 auto
}

nav {
    text-align: center;
    margin: 0 auto
}

.tableau{
    width: 100%;
    margin: 0 auto;
    display: block;
}
</style>


