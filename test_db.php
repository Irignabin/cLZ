<?php
$connection = mysqli_connect("localhost", "root", "", "blood_donation_db");
if($connection) {
    echo "Database connection successful!";
} else {
    echo "Database connection failed! Error: " . mysqli_connect_error();
}
?> 