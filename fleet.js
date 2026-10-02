/* Демонстрационный парк корневого проекта и правила переноса в хозяйство. */
const AuroraFleet = (() => {
  const machineTypes = Object.freeze([
    { name: 'Трактор', description: 'Колёсные, гусеничные, компактные тракторы.' },
    { name: 'Посевная техника', description: 'Сеялки, посадочные и рассадопосадочные машины.' },
    { name: 'Почвообработка', description: 'Плуги, культиваторы, бороны, дискаторы, глубокорыхлители.' },
    { name: 'Уборочная техника', description: 'Зерноуборочные, кормоуборочные, картофелеуборочные и свеклоуборочные комбайны.' },
    { name: 'Кормозаготовка', description: 'Косилки, грабли, ворошилки, пресс-подборщики.' },
    { name: 'Внесение удобрений', description: 'Разбрасыватели минеральных и органических удобрений, навозоразбрасыватели.' },
    { name: 'Защита растений', description: 'Самоходные и прицепные опрыскиватели.' },
    { name: 'Транспортировка', description: 'Сельхозприцепы, перегрузчики зерна, бункеры-перегрузчики.' },
    { name: 'Погрузочная техника', description: 'Телескопические, фронтальные и другие погрузчики.' },
    { name: 'Полив и мелиорация', description: 'Дождевальные машины, насосные установки, ирригационная техника.' },
    { name: 'Специализированная техника', description: 'Садовая, виноградная, овощеводческая, лесная техника.' },
  ]);
  const initialProjectMachines = [
    { id: 'mtz-3022', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Трактор', trackerOffset: 0 },
    { id: 'john-deere-8430', name: 'John Deere 8430', plate: 'АВ 1934', type: 'Трактор', trackerOffset: 0 },
    { id: 'mtz-1523', name: 'МТЗ-1523', plate: 'АВ 7102', type: 'Трактор', trackerOffset: 0 },
    { id: 'kirovets-k-742', name: 'Кировец К-742', plate: 'АВ 3396', type: 'Трактор', trackerOffset: 0 },
  ];
  const rootMachines = [
    ...initialProjectMachines.map(({ id, name, plate }) => ({ id, name, plate })),
    { id: 'claas-lexion-760', name: 'CLAAS LEXION 760', plate: 'АВ 7624' },
    { id: 'fendt-724-vario', name: 'Fendt 724 Vario', plate: 'АВ 7282' },
    { id: 'amazone-pantera-4504', name: 'Amazone Pantera 4504', plate: 'АВ 6012' },
    { id: 'jcb-531-70', name: 'JCB 531-70', plate: 'АВ 4839' },
    { id: 'kamaz-65115', name: 'КамАЗ 65115', plate: 'АВ 9251' },
    { id: 'rostselmash-rsm-161', name: 'Ростсельмаш РСМ 161', plate: 'АВ 1610' },
  ];
  function availableRootMachines(root, project) {
    const projectIds = new Set(project.map(machine => machine.id));
    return root.filter(machine => !projectIds.has(machine.id));
  }
  function transferMachine(project, machine, type) {
    if (!machineTypes.some(item => item.name === type)) throw new Error('Выберите тип техники из списка.');
    if (project.some(item => item.id === machine.id || item.plate === machine.plate)) throw new Error('Эта техника уже есть в проекте.');
    return [...project, { id: machine.id, name: machine.name, plate: machine.plate, type, trackerOffset: 0 }];
  }
  function updateMachineType(project, id, type) {
    if (!machineTypes.some(item => item.name === type)) throw new Error('Выберите тип техники из списка.');
    if (!project.some(machine => machine.id === id)) throw new Error('Техника не найдена в проекте.');
    return project.map(machine => machine.id === id ? { ...machine, type } : machine);
  }
  function updateMachineSettings(project, id, type, trackerOffset) {
    if (!machineTypes.some(item => item.name === type)) throw new Error('Выберите тип техники из списка.');
    if (!project.some(machine => machine.id === id)) throw new Error('Техника не найдена в проекте.');
    if (typeof trackerOffset !== 'number' || !Number.isFinite(trackerOffset) || Math.abs(trackerOffset) > 5 || Math.round(trackerOffset * 100) / 100 !== trackerOffset) {
      throw new Error('Смещение трекера должно быть от −5 до +5 м с шагом 0,01 м.');
    }
    return project.map(machine => machine.id === id ? { ...machine, type, trackerOffset } : machine);
  }
  function normalizeProjectMachines(project) {
    return project.map(machine => ({ ...machine, type: machine.type === 'Тракторы и тяга' ? 'Трактор' : machine.type, trackerOffset: machine.trackerOffset ?? 0 }));
  }
  return { machineTypes, initialProjectMachines, rootMachines, availableRootMachines, transferMachine, updateMachineType, updateMachineSettings, normalizeProjectMachines };
})();
if (typeof module !== 'undefined') module.exports = AuroraFleet;
