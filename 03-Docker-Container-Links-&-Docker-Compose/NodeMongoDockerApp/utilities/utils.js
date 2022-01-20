
/**
 * isValid - Utility function to check if the values passed are valid or not
 * @param {*} args 
 */
const isValid = (args = {}) => {

    const missingArgs = Object
        .keys(args)
        .filter((argname) => {
            const argument = args[argname];
            if (argument === null || argument === undefined) return argname;
            if (typeof argument === 'string' && !argument.trim().length) return argname;
            if (typeof argument === 'object' && argument.hasOwnProperty('length') && !argument.length) return argname;
            if (typeof argument === 'object' && !Object.keys(argument).length) return argname;
        });

    if(missingArgs.length) {
        let message = `Valid value not passed for arguments ${missingArgs.join(',')}`;
        throw new Error(message);
    }

}

module.exports = {
    isValid
};