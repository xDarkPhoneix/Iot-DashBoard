/**
 * @typedef {'admin' | 'operator' | 'viewer'} UserRole
 * @typedef {'sensor' | 'actuator' | 'camera' | 'controller'} DeviceType
 * @typedef {'online' | 'offline' | 'error'} DeviceStatus
 * @typedef {'toggle' | 'slider' | 'button'} ControlType
 * @typedef {'chart' | 'gauge' | 'stat' | 'control' | 'table' | 'alert'} WidgetType
 * @typedef {'line' | 'bar' | 'pie' | 'doughnut'} ChartType
 * @typedef {'1h' | '6h' | '24h' | '7d' | '30d'} TimeRange
 * @typedef {'info' | 'warning' | 'error' | 'success'} AlertType
 * @typedef {'low' | 'medium' | 'high' | 'critical'} AlertPriority
 * @typedef {'greater' | 'less' | 'equal' | 'not_equal'} ConditionType
 * @typedef {'alert' | 'control' | 'email' | 'webhook'} ActionType
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} DeviceData
 * @property {Date} timestamp
 * @property {Object.<string, number|string|boolean>} values
 */

/**
 * @typedef {Object} DeviceControl
 * @property {string} id
 * @property {string} name
 * @property {ControlType} type
 * @property {*} value
 * @property {number} [min]
 * @property {number} [max]
 * @property {string} [unit]
 */

/**
 * @typedef {Object} Device
 * @property {string} id
 * @property {string} name
 * @property {DeviceType} type
 * @property {DeviceStatus} status
 * @property {Date} lastSeen
 * @property {string} location
 * @property {DeviceData} [data]
 * @property {DeviceControl[]} [controls]
 */

/**
 * @typedef {Object} WidgetConfig
 * @property {ChartType} [chartType]
 * @property {TimeRange} [timeRange]
 * @property {boolean} [showLegend]
 * @property {string} [color]
 * @property {{ min?: number, max?: number, alertOnExceed?: boolean }} [threshold]
 */

/**
 * @typedef {Object} Widget
 * @property {string} id
 * @property {WidgetType} type
 * @property {string} title
 * @property {string} [deviceId]
 * @property {string} [dataKey]
 * @property {{ x: number, y: number, width: number, height: number }} position
 * @property {WidgetConfig} config
 */

/**
 * @typedef {Object} Alert
 * @property {string} id
 * @property {string} title
 * @property {string} message
 * @property {AlertType} type
 * @property {Date} timestamp
 * @property {string} [deviceId]
 * @property {boolean} acknowledged
 * @property {AlertPriority} priority
 */

/**
 * @typedef {Object} AutomationRule
 * @property {string} id
 * @property {string} name
 * @property {boolean} enabled
 * @property {{ deviceId: string, dataKey: string, condition: ConditionType, value: number|string|boolean }} trigger
 * @property {{ type: ActionType, config: Object.<string, any> }[]} actions
 */

/**
 * @typedef {Object} DashboardLayout
 * @property {string} id
 * @property {string} name
 * @property {Widget[]} widgets
 * @property {boolean} isDefault
 */
