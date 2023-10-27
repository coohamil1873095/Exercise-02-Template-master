class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(0.5)
        this.ball.body.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        // add walls
        this.wallA = this.physics.add.sprite(0, height / 4, 'wall')
        this.wallA.setX(Phaser.Math.Between(0 + this.wallA.width / 2, width - this.wallA.width / 2))
        this.wallA.body.setCollideWorldBounds(true)
        this.wallA.body.setBounce(1)
        this.wallA.body.setImmovable(true)
        this.wallA.body.setVelocityX(100)

        this.wallB = this.physics.add.sprite(0, height / 2, 'wall')
        this.wallB.setX(Phaser.Math.Between(0 + this.wallB.width / 2, width - this.wallB.width / 2))
        this.wallB.body.setCollideWorldBounds(true)
        this.wallB.body.setBounce(1)
        this.wallB.body.setImmovable(true)
        this.wallB.body.setVelocityX(100)

        this.walls = this.add.group([ this.wallA, this.wallB ])

        // one way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // variables
        this.SHOT_VELLOCITY_X = 200
        this.SHOT_VELLOCITY_Y_MIN = 700
        this.SHOT_VELLOCITY_Y_MAX = 1100

        this.input.on('pointerdown', (pointer) => {
            let shotDirectionY, shotDirectionX
            pointer.y <= this.ball.y ? shotDirectionY = 1 : shotDirectionY = -1
            shotDirectionX = this.ball.x - pointer.x
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELLOCITY_X, this.SHOT_VELLOCITY_X) * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELLOCITY_Y_MIN, this.SHOT_VELLOCITY_Y_MAX) * shotDirectionY)
        })

        this.holeIn = false
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.holeIn = true
        })
        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        if (this.holeIn) {
            this.ball.setPosition(width / 2, height - height / 10)
        }
    }
}