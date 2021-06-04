export const validateres = (res, continuezyx) => {
    if (res.success && continuezyx)
        return res.result.data
    return [];
}

export const getDomain = domain_name => {
    return {
        method: "SP_SEL_DOMAIN",
        data: {
            domain_name,
            status: 'ACTIVO'
        }
    }
}

export const getDomainx = domains => {
    return {
        method: "SP_SEL_DOMAIN",
        data: {
            domain_name,
            status: 'ACTIVO'
        }
    }
}