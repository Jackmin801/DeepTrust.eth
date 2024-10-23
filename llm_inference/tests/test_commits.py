from deeptrust.commits import Commit


def test_file_io(tmp_path):
    commit = Commit(
        model_name="gpt2",
        device="cuda",
        dtype="float32",
        engine="hf",
        hashes=["abc", "def"],
        completion=[0, 1, 2, 124],
        input_tokens=2,
        generation_config={"max_length": 100},
    )
    commit.to_file(tmp_path / "commit.json")
    loaded_commit = Commit.from_file(tmp_path / "commit.json")
    assert commit == loaded_commit

    commit = Commit(
        model_name="gpt2",
        device="cuda",
        dtype="float32",
        engine="hf",
        hashes=["abc", "def"],
        completion=None,
        input_tokens=2,
        generation_config={"max_length": 100},
    )
    commit.to_file(tmp_path / "commit.json")
    loaded_commit = Commit.from_file(tmp_path / "commit.json")
    assert commit == loaded_commit
