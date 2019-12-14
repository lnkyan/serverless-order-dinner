const orderFoodLogic = require('../src/logic/logic')


async function create() {
    const result = await orderFoodLogic.createTodayMenu(undefined, '123', ['lnk'])
    console.log(result)
}

async function load() {
    const result = await orderFoodLogic.getTodayMenu()
    console.log(result)
}

async function update() {
    const menuData = await orderFoodLogic.getTodayMenu()
    const result = await orderFoodLogic.updateTodayMenu(menuData.id, undefined, '456')
    console.log(result)
}

async function agree() {
    const menuData = await orderFoodLogic.getTodayMenu()
    await orderFoodLogic.agree(menuData.id, 'peopleA')
    const result = await orderFoodLogic.getTodayMenu()
    console.log(result)
}

async function disagree() {
    const menuData = await orderFoodLogic.getTodayMenu()
    await orderFoodLogic.disagree(menuData.id, 'peopleA')
    const result = await orderFoodLogic.getTodayMenu()
    console.log(result)
}

async function disagreeB() {
    const menuData = await orderFoodLogic.getTodayMenu()
    await orderFoodLogic.disagree(menuData.id, 'peopleB')
    const result = await orderFoodLogic.getTodayMenu()
    console.log(result)
}

async function test(testArr) {
    for (let i = 0; i < testArr.length; i++) {
        await testArr[i]()
    }
}

test([
    create,
    load,
    update,
    agree,
    disagree,
    disagreeB,
])