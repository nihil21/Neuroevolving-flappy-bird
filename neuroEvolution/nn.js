class NeuralNetwork {
    constructor(in_nodes, hid_nodes, out_nodes) {
        this.input_nodes = in_nodes;
        this.hidden_nodes = hid_nodes;
        this.output_nodes = out_nodes;

        this.weights_ih = tf.randomNormal([this.input_nodes, this.hidden_nodes]);
        this.weights_ho = tf.randomNormal([this.hidden_nodes, this.output_nodes]);
    }

    predict(inputs) {
        let output;
        
        tf.tidy(() => {
            let input_layer = tf.tensor(inputs, [1, this.input_nodes]);
            let hidden_layer = input_layer.matMul(this.weights_ih).sigmoid();
            let output_layer = hidden_layer.matMul(this.weights_ho).sigmoid();
            output = output_layer.dataSync();
        });
        
        return output;
    }

    clone() {
        let cloneNN = new NeuralNetwork(this.input_nodes, this.hidden_nodes, this.output_nodes);
        cloneNN.dispose();
        cloneNN.weights_ih = tf.clone(this.weights_ih);
        cloneNN.weights_ho = tf.clone(this.weights_ho);
        
        return cloneNN;
    }

    mutate(fn) {
        let newWeights_ih = this.weights_ih.dataSync().map(fn);
        let newWeights_ih_shape = this.weights_ih.shape;
        this.weights_ih.dispose();
        this.weights_ih = tf.tensor(newWeights_ih, newWeights_ih_shape);

        let newWeights_ho = this.weights_ho.dataSync().map(fn);
        let newWeights_ho_shape = this.weights_ho.shape;
        this.weights_ho.dispose();
        this.weights_ho = tf.tensor(newWeights_ho, newWeights_ho_shape);
    }

    dispose() {
        this.weights_ih.dispose();
        this.weights_ho.dispose();
    }
}