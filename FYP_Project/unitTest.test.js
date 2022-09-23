const tokenRetrieval = require('./tokenRetrieval/InternalToken')
const getOrganizationData = require('./getOrganization/getOrganization')

test('tokenRetrieval function', async () => {
    const token = await tokenRetrieval('Internal')
    expect(token).toContain('V_hklZEdOpVc5BAoDjGK_t2Gs6g-Nf9W9e8wWBZPmPI')
}
)

test('getOrganizationDataInternal function', async () => {
    const token = await tokenRetrieval('Internal')
    const orgData = await getOrganizationData('Internal', token)
    expect(orgData[0].name).toContain('Internal')
}
)

test('getOrganizationDataSeviora function', async () => {
    const token = await tokenRetrieval('Seviora')
    const orgData = await getOrganizationData('Seviora', token)
    expect(orgData[0].name).toContain('Internal Infrastructure')
}
)