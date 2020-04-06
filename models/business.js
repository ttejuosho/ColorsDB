module.exports = function(sequelize, DataTypes) {
    const Business = sequelize.define('Business', {
        __id: {
            type: DataTypes.STRING,
        },
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        license_id: {
            type: DataTypes.INTEGER,
        },
        account_number: {
            type: DataTypes.INTEGER,
        },
        site_number: {
            type: DataTypes.STRING,
        },
        legal_name: {
            type: DataTypes.STRING,
        },
        doing_business_as_name: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        zip_code: {
            type: DataTypes.STRING,
        },
        ward: {
            type: DataTypes.STRING,
        },
        precinct: {
            type: DataTypes.STRING,
        },
        ward_precinct: {
            type: DataTypes.STRING,
        },
        police_precinct: {
            type: DataTypes.STRING,
        },
        licence_code: {
            type: DataTypes.INTEGER,
        },
        license_description: {
            type: DataTypes.STRING,
        },
        business_activity_id: {
            type: DataTypes.STRING,
        },
        business_activity: {
            type: DataTypes.STRING,
        },
        licence_number: {
            type: DataTypes.INTEGER,
        },
        application_type: {
            type: DataTypes.STRING,
        },
        application_created_date: {
            type: DataTypes.DATE,
        },
        application_requirements_complete: {
            type: DataTypes.STRING,
        },
        payment_date: {
            type: DataTypes.STRING,
        },
        conditional_approval: {
            type: DataTypes.STRING,
        },
        licence_start_date: {
            type: DataTypes.STRING,
        },
        expiration_date: {
            type: DataTypes.STRING,
        },
        licence_approved_for_issuance: {
            type: DataTypes.STRING,
        },
        date_issued: {
            type: DataTypes.STRING,
        },
        licence_status: {
            type: DataTypes.STRING,
        },
        licence_status_change_date: {
            type: DataTypes.STRING,
        },
        ssa: {
            type: DataTypes.STRING,
        },
        latitude: {
            type: DataTypes.STRING,
        },
        longitude: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
        },
        location_address: {
            type: DataTypes.STRING,
        },
        location_city: {
            type: DataTypes.STRING,
        },
        location_state: {
            type: DataTypes.STRING,
        },
        location_zip: {
            type: DataTypes.STRING,
        }
    });
    return Business;
}